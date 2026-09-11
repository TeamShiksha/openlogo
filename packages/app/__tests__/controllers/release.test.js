"use strict";

const request = require("supertest");
const app = require("../../server");
const ReleaseService = require("../../services/release");
const { OLD_RELEASES } = require("../../utils/constants");

jest.mock("../../services/release");

describe("Releases Controller & Routes (/api/releases)", () => {
  let mockGetAllReleases;
  let mockGetReleaseByVersion;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllReleases = jest.fn();
    mockGetReleaseByVersion = jest.fn();

    ReleaseService.prototype.getAllReleases = mockGetAllReleases;
    ReleaseService.prototype.getReleaseByVersion = mockGetReleaseByVersion;
  });

  describe("GET /api/releases", () => {
    it("returns 200 with paginated releases data and archivedReleases", async () => {
      const mockResult = {
        data: [
          {
            version: "v1.0.0",
            releaseDate: "2026-09-01T00:00:00.000Z",
            githubReleaseId: 101,
            githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.0.0",
            entries: [],
          },
        ],
        total: 1,
        currentPage: 1,
        totalPages: 1,
      };

      mockGetAllReleases.mockResolvedValue(mockResult);

      const res = await request(app).get("/api/releases");

      expect(res.status).toBe(200);
      expect(res.body.statusCode).toBe(200);
      expect(res.body.data).toEqual(mockResult.data);
      expect(res.body.pagination).toEqual({
        total: 1,
        currentPage: 1,
        totalPages: 1,
        limit: 10,
      });
      expect(res.body.archivedReleases).toEqual(OLD_RELEASES);
      expect(mockGetAllReleases).toHaveBeenCalledWith(1, 10);
    });

    it("parses page and limit query parameters", async () => {
      mockGetAllReleases.mockResolvedValue({
        data: [],
        total: 20,
        currentPage: 2,
        totalPages: 4,
      });

      const res = await request(app).get("/api/releases?page=2&limit=5");

      expect(res.status).toBe(200);
      expect(mockGetAllReleases).toHaveBeenCalledWith(2, 5);
      expect(res.body.pagination.limit).toBe(5);
    });

    it("clamps page to minimum 1 and limit between 1 and 100", async () => {
      mockGetAllReleases.mockResolvedValue({
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      });

      await request(app).get("/api/releases?page=-5&limit=500");

      expect(mockGetAllReleases).toHaveBeenCalledWith(1, 100);
    });
  });

  describe("GET /api/releases/:version", () => {
    it("returns 200 with single release data when version exists", async () => {
      const releaseData = {
        version: "v1.2.0",
        releaseDate: "2026-09-10T00:00:00.000Z",
        githubReleaseId: 202,
        githubReleaseUrl: "https://github.com/org/repo/releases/tag/v1.2.0",
        entries: [
          {
            category: "Feature",
            prNumber: 1042,
            title: "Revamp USER Dashboard",
            description: "Redesign UI",
            contributors: [{ username: "personA" }],
          },
        ],
      };

      mockGetReleaseByVersion.mockResolvedValue(releaseData);

      const res = await request(app).get("/api/releases/v1.2.0");

      expect(res.status).toBe(200);
      expect(res.body.statusCode).toBe(200);
      expect(res.body.data).toEqual(releaseData);
      expect(mockGetReleaseByVersion).toHaveBeenCalledWith("v1.2.0");
    });

    it("returns 200 for archived release version tag", async () => {
      const archivedRelease = OLD_RELEASES[0];
      mockGetReleaseByVersion.mockResolvedValue(archivedRelease);

      const res = await request(app).get(
        `/api/releases/${encodeURIComponent(archivedRelease.version)}`
      );

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(archivedRelease);
    });

    it("returns 404 when release version is not found", async () => {
      mockGetReleaseByVersion.mockResolvedValue(null);

      const res = await request(app).get("/api/releases/v9.9.9");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        statusCode: 404,
        error: "Not Found",
        message: "Release v9.9.9 not found.",
      });
    });
  });
});
