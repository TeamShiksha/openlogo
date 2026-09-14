"use strict";

const mongoose = require("mongoose");
const Release = require("../../models/release");
const {
  syncRelease,
  parseReleaseBody,
  validateGitHubEntities,
  formatValidationErrors,
} = require("../../scripts/releases/syncNewReleases");

describe("syncNewReleases Script & Parser", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Unit Tests: parseReleaseBody
  // -------------------------------------------------------------------------
  describe("parseReleaseBody", () => {
    it("1. One category, one entry, one contributor with emoji in category header", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Full redesign of the user interface according to the latest design specifications for improved usability.

> Contributors: @personA
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual({
        category: "Feature",
        prNumber: 1042,
        title: "Revamp USER Dashboard",
        description:
          "Full redesign of the user interface according to the latest design specifications for improved usability.",
        contributors: [{ username: "personA" }],
      });
    });

    it("2. Optional release introduction before first category header is ignored", () => {
      const body = `
Welcome to version 0.8.0! This release introduces major UI improvements.

### 📝 Features

#### #1042 | Revamp USER Dashboard

Full redesign description.

> Contributors: @personA
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].prNumber).toBe(1042);
    });

    it("3. One category, multiple entries", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

First entry description.

> Contributors: @personA

#### #1043 | Add Dark Mode

Second entry description.

> Contributors: @personB
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].prNumber).toBe(1042);
      expect(entries[1].prNumber).toBe(1043);
    });

    it("4. Multiple contributors in blockquote format", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description here.

> Contributors: @personA @personB
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].contributors).toEqual([
        { username: "personA" },
        { username: "personB" },
      ]);
    });

    it("5. Multiple categories with leading emojis", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description.

> Contributors: @personA

### 📝 Enhancements

#### #1052 | Improve Release Page Performance

Description.

> Contributors: @personA

### 📝 Bug Fixes

#### #1050 | Fix Login Crash

Description.

> Contributors: @personC

### 📝 Security

#### #1044 | Two-Factor Authentication

Description.

> Contributors: @personD

### 📝 Others

#### #1060 | Improve CI Pipeline

Description.

> Contributors: @personE
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(5);
      expect(entries.map((e) => e.category)).toEqual([
        "Feature",
        "Enhancement",
        "Bug Fix",
        "Security",
        "Other",
      ]);
    });

    it("6. Rejects empty category or leftover 'Entry' placeholder", () => {
      const bodyEmpty = `
### 📝 Features

#### #1042 | Valid Feature

Description.

> Contributors: @personA

### 📝 Enhancements

Entry
`;
      const { errors: errorsEmpty } = parseReleaseBody(bodyEmpty);
      expect(errorsEmpty.length).toBeGreaterThan(0);
      expect(errorsEmpty[0].message).toMatch(/Leftover placeholder "Entry"/i);
    });

    it("7. Empty description is supported", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

> Contributors: @personA
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].description).toBe("");
    });

    // -----------------------------------------------------------------------
    // Invalid test cases
    // -----------------------------------------------------------------------

    it("8. Missing PR number", () => {
      const body = `
### 📝 Features

#### Revamp USER Dashboard

Description.

> Contributors: @personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Invalid entry heading/i);
    });

    it("9. Invalid/non-positive PR number", () => {
      const bodyPos = `
### 📝 Features

#### #-10 | Revamp USER Dashboard

Description.

> Contributors: @personA
`;
      const { errors: errorsPos } = parseReleaseBody(bodyPos);
      expect(errorsPos.length).toBeGreaterThan(0);
      expect(errorsPos[0].message).toMatch(/Invalid PR number/i);
    });

    it("10. Missing title", () => {
      const body = `
### 📝 Features

#### #1042 |

Description.

> Contributors: @personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Missing or empty title/i);
    });

    it("11. Missing Contributors field", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description without contributors line.
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Missing required Contributors field/i);
    });

    it("12. Contributor without @", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description.

> Contributors: personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(
        /must use GitHub username syntax beginning with "@"/i
      );
    });
  });

  // -------------------------------------------------------------------------
  // Unit Tests: formatValidationErrors
  // -------------------------------------------------------------------------
  describe("formatValidationErrors", () => {
    it("formats errors into readable string", () => {
      const mockErrors = [
        {
          section: "Feature",
          pr: 1042,
          message: "Missing required Contributors field.",
        },
        {
          section: "Enhancement",
          pr: 1052,
          message: "Invalid PR number.",
        },
      ];

      const formatted = formatValidationErrors(mockErrors);
      expect(formatted).toContain("Feature → PR #1042");
      expect(formatted).toContain("Missing required Contributors field.");
      expect(formatted).toContain("Enhancement → PR #1052");
    });
  });

  // -------------------------------------------------------------------------
  // Unit Tests: validateGitHubEntities
  // -------------------------------------------------------------------------
  describe("validateGitHubEntities", () => {
    it("13. Invalid GitHub username", async () => {
      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes("/pulls/1042")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ number: 1042 }),
          });
        }
        if (url.includes("/users/invaliduser")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            text: () => Promise.resolve("Not Found"),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      const entries = [
        {
          category: "Feature",
          prNumber: 1042,
          title: "Valid Title",
          contributors: [{ username: "invaliduser" }],
        },
      ];

      const errors = await validateGitHubEntities(
        entries,
        "owner",
        "repo",
        "token"
      );

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(
        /Invalid contributor "@invaliduser". GitHub user could not be found/i
      );
    });

    it("14. Non-existent PR", async () => {
      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes("/pulls/9999")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            text: () => Promise.resolve("Not Found"),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      const entries = [
        {
          category: "Feature",
          prNumber: 9999,
          title: "Valid Title",
          contributors: [{ username: "alice" }],
        },
      ];

      const errors = await validateGitHubEntities(
        entries,
        "owner",
        "repo",
        "token"
      );

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/PR #9999 could not be found/i);
    });
  });

  // -------------------------------------------------------------------------
  // Integration Tests: MongoDB atomic upsert & full syncRelease workflow
  // -------------------------------------------------------------------------
  describe("syncRelease MongoDB Integration", () => {
    let mongoUri;

    beforeAll(async () => {
      mongoUri = process.env.MONGO_URL;
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }
    });

    afterAll(async () => {
      await Release.deleteMany({});
      if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.close();
      }
    });

    beforeEach(async () => {
      await Release.deleteMany({});
    });

    it("successfully syncs valid release storing version and tagName separately", async () => {
      const tag = "v0.8.0";
      const name = "0.8.0";
      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const validReleaseBody = `
Welcome to 0.8.0 release.

### 📝 Features

#### #1042 | Revamp USER Dashboard

Full redesign description.

> Contributors: @personA @personB

### 📝 Others

#### #1060 | Improve CI Pipeline

Migrated CI pipeline.

> Contributors: @personC
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 12345,
                name: name,
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: validReleaseBody,
              }),
          });
        }
        if (url.includes("/pulls/")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        if (url.includes("/users/")) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
        }
        return Promise.resolve({
          ok: false,
          status: 404,
          text: () => Promise.resolve(""),
        });
      });

      await syncRelease();

      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }

      const doc = await Release.findOne({ version: name });
      expect(doc).not.toBeNull();
      expect(doc.version).toBe("0.8.0");
      expect(doc.tagName).toBe("v0.8.0");
      expect(doc.githubReleaseId).toBe(12345);
      expect(doc.entries).toHaveLength(2);
      expect(doc.entries[0]).toMatchObject({
        category: "Feature",
        prNumber: 1042,
        title: "Revamp USER Dashboard",
        contributors: [{ username: "personA" }, { username: "personB" }],
      });
    });

    it("fails validation on invalid release and writes NOTHING to MongoDB", async () => {
      const tag = "v2.0.0-invalid";
      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const invalidReleaseBody = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description.

> Contributors: personA
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 99999,
                name: "2.0.0-invalid",
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: invalidReleaseBody,
              }),
          });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(syncRelease()).rejects.toThrow("Release validation failed.");

      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }

      const doc = await Release.findOne({ version: "2.0.0-invalid" });
      expect(doc).toBeNull();
    });
  });
});
