"use strict";

const mongoose = require("mongoose");
const Release = require("../../models/release");
const {
  syncRelease,
  parseReleaseBody,
  validateGitHubEntities,
  formatValidationErrors,
} = require("../../scripts/syncReleases");

describe("syncReleases Script & Parser", () => {
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
    it("1. One category, one entry, one contributor", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Full redesign of the user interface according to the latest design specifications for improved usability.

**Contributors:** @personA
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

    it("2. One category, multiple entries", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

First entry description.

**Contributors:** @personA

### #1043 | Add Dark Mode

Second entry description.

**Contributors:** @personB
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].prNumber).toBe(1042);
      expect(entries[1].prNumber).toBe(1043);
    });

    it("3. One entry with multiple contributors", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description here.

**Contributors:** @personA @personB
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].contributors).toEqual([
        { username: "personA" },
        { username: "personB" },
      ]);
    });

    it("4. Multiple categories", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description.

**Contributors:** @personA

## Enhancements

### #1052 | Improve Release Page Performance

Description.

**Contributors:** @personA

## Bug Fixes

### #1050 | Fix Login Crash

Description.

**Contributors:** @personC

## Security

### #1044 | Two-Factor Authentication

Description.

**Contributors:** @personD

## Others

### #1060 | Improve CI Pipeline

Description.

**Contributors:** @personE
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

    it("5. Empty description", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

**Contributors:** @personA
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].description).toBe("");
    });

    it("6. Multiple contributors with varying whitespace", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description.

**Contributors:** @alice   @bob    @charlie
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].contributors).toEqual([
        { username: "alice" },
        { username: "bob" },
        { username: "charlie" },
      ]);
    });

    it("18. Valid 'Others' entry", () => {
      const body = `
## Others

### #1060 | Improve CI Pipeline

Migrated the CI pipeline to improve build reliability and reduce execution time.

**Contributors:** @personA @personB
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual({
        category: "Other",
        prNumber: 1060,
        title: "Improve CI Pipeline",
        description:
          "Migrated the CI pipeline to improve build reliability and reduce execution time.",
        contributors: [{ username: "personA" }, { username: "personB" }],
      });
    });

    it("19. Multiple 'Others' entries", () => {
      const body = `
## Others

### #1060 | Improve CI Pipeline

Description A.

**Contributors:** @personA

### #1062 | Update Docker Configuration

Description B.

**Contributors:** @personC
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].category).toBe("Other");
      expect(entries[1].category).toBe("Other");
      expect(entries[0].prNumber).toBe(1060);
      expect(entries[1].prNumber).toBe(1062);
    });

    it("20. Multiple contributors in 'Others'", () => {
      const body = `
## Others

### #1060 | Improve CI Pipeline

Description.

**Contributors:** @personA @personB @personC
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries[0].category).toBe("Other");
      expect(entries[0].contributors).toEqual([
        { username: "personA" },
        { username: "personB" },
        { username: "personC" },
      ]);
    });

    // -----------------------------------------------------------------------
    // Invalid test cases
    // -----------------------------------------------------------------------

    it("7. Missing PR number", () => {
      const body = `
## Features

### Revamp USER Dashboard

Description.

**Contributors:** @personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Invalid entry heading/i);
    });

    it("8. Invalid/non-positive PR number", () => {
      const bodyPos = `
## Features

### #-10 | Revamp USER Dashboard

Description.

**Contributors:** @personA
`;
      const { errors: errorsPos } = parseReleaseBody(bodyPos);
      expect(errorsPos.length).toBeGreaterThan(0);
      expect(errorsPos[0].message).toMatch(/Invalid PR number/i);

      const bodyEmptyPR = `
## Features

### # | Revamp USER Dashboard

Description.

**Contributors:** @personA
`;
      const { errors: errorsEmpty } = parseReleaseBody(bodyEmptyPR);
      expect(errorsEmpty.length).toBeGreaterThan(0);
      expect(errorsEmpty[0].message).toMatch(/Invalid PR number/i);
    });

    it("9. Missing title", () => {
      const body = `
## Features

### #1042 |

Description.

**Contributors:** @personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Missing or empty title/i);
    });

    it("10. Empty title", () => {
      const body = `
## Features

### #1042 |    

Description.

**Contributors:** @personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Missing or empty title/i);
    });

    it("11. Missing Contributors field", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description without contributors line.
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Missing required Contributors field/i);
    });

    it("12. Empty Contributors field", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description.

**Contributors:**
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Empty Contributors field/i);
    });

    it("13. Contributor without @", () => {
      const body = `
## Features

### #1042 | Revamp USER Dashboard

Description.

**Contributors:** personA
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(
        /must use GitHub username syntax beginning with "@"/i
      );
    });

    it("16. Malformed H3 entry that would otherwise be silently skipped", () => {
      const body = `
## Features

### #1042 | Valid Feature

Description.

**Contributors:** @alice

### Invalid Feature

Description.

**Contributors:** @bob
`;
      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((e) => e.message.includes("Invalid entry heading"))
      ).toBe(true);
    });

    it("17. Unknown section should not create a DB entry or cause error", () => {
      const body = `
## Hero Image

![Hero Banner](https://example.com/banner.png)

## Features

### #1042 | Valid Feature

Description.

**Contributors:** @alice
`;
      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].category).toBe("Feature");
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
    it("14. Invalid GitHub username", async () => {
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

    it("15. Non-existent PR", async () => {
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

    it("successfully syncs valid release into MongoDB", async () => {
      const tag = "v1.0.0-test";
      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const validReleaseBody = `
## Features

### #1042 | Revamp USER Dashboard

Full redesign description.

**Contributors:** @personA @personB

## Others

### #1060 | Improve CI Pipeline

Migrated CI pipeline.

**Contributors:** @personC
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 12345,
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

      // Connect back to inspect DB document (since syncRelease closes connection in finally)
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }

      const doc = await Release.findOne({ version: tag });
      expect(doc).not.toBeNull();
      expect(doc.version).toBe(tag);
      expect(doc.githubReleaseId).toBe(12345);
      expect(doc.entries).toHaveLength(2);
      expect(doc.entries[0]).toMatchObject({
        category: "Feature",
        prNumber: 1042,
        title: "Revamp USER Dashboard",
        contributors: [{ username: "personA" }, { username: "personB" }],
      });
      expect(doc.entries[1]).toMatchObject({
        category: "Other",
        prNumber: 1060,
        title: "Improve CI Pipeline",
        contributors: [{ username: "personC" }],
      });
    });

    it("fails validation on invalid release and writes NOTHING to MongoDB", async () => {
      const tag = "v2.0.0-invalid";
      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const invalidReleaseBody = `
## Features

### #1042 | Revamp USER Dashboard

Description.

**Contributors:** personA
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 99999,
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

      const doc = await Release.findOne({ version: tag });
      expect(doc).toBeNull();
    });
  });
});
