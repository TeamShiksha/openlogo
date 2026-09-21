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
    it("1. Parses one category, one entry, and one contributor with emoji", () => {
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

    it("2. Allows an optional release introduction before the first category", () => {
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

    it("3. Parses multiple entries in one category", () => {
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

    it("4. Parses multiple contributors", () => {
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

    it("5. Parses all supported categories", () => {
      const body = `
### 📝 Features

#### #1042 | Revamp USER Dashboard

Description.

> Contributors: @personA

### 📝 Enhancements

#### #1052 | Improve Release Page

Description.

> Contributors: @personA

### 📝 Bug Fixes

#### #1050 | Fix Login Crash

Description.

> Contributors: @personC

### 📝 Security

#### #1044 | Add Two-Factor Authentication

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
      expect(entries.map((entry) => entry.category)).toEqual([
        "Feature",
        "Enhancement",
        "Bug Fix",
        "Security",
        "Other",
      ]);
    });

    it("6. Allows supported category headings without the emoji", () => {
      const body = `
### Features

#### #1042 | Add Search

Add search functionality.

> Contributors: @personA
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].category).toBe("Feature");
    });

    it("7. Rejects empty category sections", () => {
      const body = `
### 📝 Features

#### #1042 | Valid Feature

Description.

> Contributors: @personA

### 📝 Enhancements
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Empty section/i);
    });

    it("8. Rejects leftover Entry placeholder", () => {
      const body = `
### 📝 Features

Entry
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].message).toMatch(/Leftover placeholder "Entry"/i);
    });

    it("9. Rejects zero parsed entries when release contains no categories", () => {
      const body = `
This release contains some introductory text but no release entries.
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(entries).toHaveLength(0);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /zero parsed entries/i.test(error.message))
      ).toBe(true);
    });

    it("10. Rejects zero parsed entries for an empty release body", () => {
      const { entries, errors } = parseReleaseBody("");

      expect(entries).toHaveLength(0);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /zero parsed entries/i.test(error.message))
      ).toBe(true);
    });

    it("11. Rejects unsupported category headings", () => {
      const body = `
### 📝 Improvements

#### #1042 | Improve Release Page

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Unsupported category heading/i.test(error.message)
        )
      ).toBe(true);
    });

    it("12. Rejects incorrect category heading level", () => {
      const body = `
## 📝 Features

#### #1042 | Add Search

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Invalid heading level "H2"/i.test(error.message)
        )
      ).toBe(true);
    });

    it("13. Rejects incorrect heading level H4 used as a category", () => {
      const body = `
#### 📝 Features

#### #1042 | Add Search

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
    });

    it("14. Rejects empty description", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /Missing description/i.test(error.message))
      ).toBe(true);
    });

    it("15. Rejects Contributors field without blockquote marker", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

Description.

Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Invalid Contributors field/i.test(error.message)
        )
      ).toBe(true);
    });

    it("16. Rejects Contributors field without @ username syntax", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

Description.

> Contributors: personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /must use GitHub username syntax beginning with "@"/i.test(
            error.message
          )
        )
      ).toBe(true);
    });

    it("17. Rejects missing Contributors field", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

Description without contributors.
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Missing required Contributors field/i.test(error.message)
        )
      ).toBe(true);
    });

    it("18. Rejects duplicate Contributors fields", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

Description.

> Contributors: @personA

> Contributors: @personB
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Duplicate Contributors fields/i.test(error.message)
        )
      ).toBe(true);
    });

    it("19. Rejects content after Contributors field", () => {
      const body = `
### 📝 Features

#### #1042 | Add Search

Description.

> Contributors: @personA

Unexpected content.
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Unexpected content found after the Contributors field/i.test(
            error.message
          )
        )
      ).toBe(true);
    });

    it("20. Allows another entry after the previous Contributors field", () => {
      const body = `
### 📝 Features

#### #1042 | First Feature

First description.

> Contributors: @personA

#### #1043 | Second Feature

Second description.

> Contributors: @personB
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].prNumber).toBe(1042);
      expect(entries[1].prNumber).toBe(1043);
    });

    it("21. Allows duplicate PR numbers within the same release", () => {
      const body = `
### 📝 Features

#### #1042 | First Feature

First description.

> Contributors: @personA

#### #1042 | Second Feature

Second description.

> Contributors: @personB
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].prNumber).toBe(1042);
      expect(entries[1].prNumber).toBe(1042);
    });

    it("22. Allows the same PR across different categories", () => {
      const body = `
### 📝 Features

#### #1042 | Add Release Search

Add release search.

> Contributors: @personA

### 📝 Enhancements

#### #1042 | Improve Release Search

Improve release search.

> Contributors: @personA
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(2);
      expect(entries[0].prNumber).toBe(1042);
      expect(entries[1].prNumber).toBe(1042);
    });

    it("23. Ignores headings inside HTML comments", () => {
      const body = `
<!--
### 📝 Features

#### #999 | Fake Feature

Fake description.

> Contributors: @fake-user
-->

### 📝 Features

#### #1042 | Real Feature

Real description.

> Contributors: @personA
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(errors).toHaveLength(0);
      expect(entries).toHaveLength(1);
      expect(entries[0].prNumber).toBe(1042);
    });

    it("24. Rejects content after the Contributors field", () => {
      const body = `
### 📝 Features

#### #1042 | Real Feature

Real description.

> Contributors: @personA

Unexpected content after contributors.
`;

      const { entries, errors } = parseReleaseBody(body);

      expect(entries).toHaveLength(1);
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toMatch(
        /Unexpected content found after the Contributors field/i
      );
    });

    it("25. Rejects malformed H4 entry heading", () => {
      const body = `
### 📝 Features

#### Revamp Release Page

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /Invalid entry heading/i.test(error.message))
      ).toBe(true);
    });

    it("26. Rejects invalid PR number", () => {
      const body = `
### 📝 Features

#### #-10 | Invalid PR

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /Invalid PR number/i.test(error.message))
      ).toBe(true);
    });

    it("27. Rejects missing title", () => {
      const body = `
### 📝 Features

#### #1042 |

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) => /Missing or empty title/i.test(error.message))
      ).toBe(true);
    });

    it("28. Rejects malformed content before first entry", () => {
      const body = `
### 📝 Features

Unexpected content before entry.

#### #1042 | Add Search

Description.

> Contributors: @personA
`;

      const { errors } = parseReleaseBody(body);

      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          /Malformed content before entry/i.test(error.message)
        )
      ).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Unit Tests: formatValidationErrors
  // -------------------------------------------------------------------------

  describe("formatValidationErrors", () => {
    it("formats validation errors into a readable string", () => {
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
    it("29. Rejects invalid GitHub username", async () => {
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

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
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

    it("30. Rejects non-existent PR", async () => {
      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes("/pulls/9999")) {
          return Promise.resolve({
            ok: false,
            status: 404,
            text: () => Promise.resolve("Not Found"),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
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
                name,
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: validReleaseBody,
              }),
          });
        }

        if (url.includes("/pulls/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          });
        }

        if (url.includes("/users/")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
          });
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

    it("fails validation on invalid release and writes nothing to MongoDB", async () => {
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

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(syncRelease()).rejects.toThrow("Release validation failed.");

      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
      }

      const doc = await Release.findOne({
        version: "2.0.0-invalid",
      });

      expect(doc).toBeNull();
    });

    it("fails validation when release contains zero parsed entries", async () => {
      const tag = "v2.0.1-empty";

      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const invalidReleaseBody = `
This release has no structured entries.
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 100001,
                name: "2.0.1-empty",
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: invalidReleaseBody,
              }),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(syncRelease()).rejects.toThrow("Release validation failed.");

      const doc = await Release.findOne({
        version: "2.0.1-empty",
      });

      expect(doc).toBeNull();
    });

    it("fails validation for unsupported category heading and writes nothing", async () => {
      const tag = "v2.0.2-unsupported-category";

      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const invalidReleaseBody = `
### 📝 Improvements

#### #1042 | Improve Release Page

Description.

> Contributors: @personA
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 100002,
                name: "2.0.2-unsupported-category",
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: invalidReleaseBody,
              }),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(syncRelease()).rejects.toThrow("Release validation failed.");

      const doc = await Release.findOne({
        version: "2.0.2-unsupported-category",
      });

      expect(doc).toBeNull();
    });

    it("fails validation for incorrect category heading level and writes nothing", async () => {
      const tag = "v2.0.3-invalid-heading";

      process.env.GITHUB_TOKEN = "fake_token";
      process.env.MONGO_URL = mongoUri;
      process.env.RELEASE_TAG = tag;
      process.env.GITHUB_REPOSITORY = "testowner/testrepo";

      const invalidReleaseBody = `
## 📝 Features

#### #1042 | Add Search

Description.

> Contributors: @personA
`;

      global.fetch = jest.fn().mockImplementation((url) => {
        if (url.includes(`/releases/tags/${encodeURIComponent(tag)}`)) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                id: 100003,
                name: "2.0.3-invalid-heading",
                tag_name: tag,
                published_at: "2026-09-11T12:00:00Z",
                html_url: `https://github.com/testowner/testrepo/releases/tag/${tag}`,
                body: invalidReleaseBody,
              }),
          });
        }

        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      });

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(syncRelease()).rejects.toThrow("Release validation failed.");

      const doc = await Release.findOne({
        version: "2.0.3-invalid-heading",
      });

      expect(doc).toBeNull();
    });
  });
});
