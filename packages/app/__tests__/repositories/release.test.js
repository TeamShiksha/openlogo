"use strict";

const mongoose = require("mongoose");
const ReleaseRepository = require("../../repositories/release");
const Release = require("../../models/release");

describe("ReleaseRepository", () => {
  let repository;
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
    repository = new ReleaseRepository();
  });

  describe("findByVersion", () => {
    it("returns matching release document without __v field", async () => {
      await Release.create({
        version: "v1.0.0",
        releaseDate: new Date("2026-09-01"),
        githubReleaseId: 100,
        githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.0.0",
        entries: [
          {
            category: "Feature",
            prNumber: 101,
            title: "Test Feature",
            description: "Test description",
            contributors: [{ username: "alice" }],
          },
        ],
      });

      const found = await repository.findByVersion("v1.0.0");
      expect(found).not.toBeNull();
      expect(found.version).toBe("v1.0.0");
      expect(found.githubReleaseId).toBe(100);
      expect(found.entries).toHaveLength(1);
      expect(found.__v).toBeUndefined();
    });

    it("returns null when version tag does not exist", async () => {
      const found = await repository.findByVersion("v9.9.9");
      expect(found).toBeNull();
    });
  });

  describe("upsertByVersion", () => {
    it("inserts a new release document when version does not exist", async () => {
      const payload = {
        releaseDate: new Date("2026-09-05"),
        githubReleaseId: 200,
        githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.1.0",
        entries: [
          {
            category: "Enhancement",
            prNumber: 102,
            title: "Performance boost",
            description: "Faster query execution",
            contributors: [{ username: "bob" }],
          },
        ],
      };

      const result = await repository.upsertByVersion("v1.1.0", payload);
      expect(result).not.toBeNull();
      expect(result.version).toBe("v1.1.0");
      expect(result.githubReleaseId).toBe(200);

      const count = await Release.countDocuments({ version: "v1.1.0" });
      expect(count).toBe(1);
    });

    it("updates existing release document atomically when version already exists", async () => {
      await Release.create({
        version: "v1.2.0",
        releaseDate: new Date("2026-09-10"),
        githubReleaseId: 300,
        githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.2.0",
        entries: [],
      });

      const updatedPayload = {
        releaseDate: new Date("2026-09-10"),
        githubReleaseId: 300,
        githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.2.0",
        entries: [
          {
            category: "Bug Fix",
            prNumber: 103,
            title: "Fix bug",
            contributors: [{ username: "charlie" }],
          },
        ],
      };

      const result = await repository.upsertByVersion("v1.2.0", updatedPayload);
      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].title).toBe("Fix bug");

      const count = await Release.countDocuments({ version: "v1.2.0" });
      expect(count).toBe(1);
    });
  });

  describe("getPaginated", () => {
    it("returns releases in reverse-chronological order with pagination metadata", async () => {
      await Release.create([
        {
          version: "v1.0.0",
          releaseDate: new Date("2026-08-01"),
          githubReleaseId: 1,
          githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.0.0",
          entries: [],
        },
        {
          version: "v2.0.0",
          releaseDate: new Date("2026-09-01"),
          githubReleaseId: 2,
          githubReleaseUrl: "https://github.com/org/repo/releases/tag/v2.0.0",
          entries: [],
        },
        {
          version: "v1.5.0",
          releaseDate: new Date("2026-08-15"),
          githubReleaseId: 3,
          githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.5.0",
          entries: [],
        },
      ]);

      const result = await repository.getPaginated(1, 2);

      expect(result.total).toBe(3);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(2);
      expect(result.data).toHaveLength(2);
      expect(result.data[0].version).toBe("v2.0.0");
      expect(result.data[1].version).toBe("v1.5.0");

      const page2 = await repository.getPaginated(2, 2);
      expect(page2.data).toHaveLength(1);
      expect(page2.data[0].version).toBe("v1.0.0");
    });
  });
});
