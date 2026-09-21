"use strict";

const ReleaseService = require("../../services/release");
const { ReleaseRepository } = require("../../repositories");

jest.mock("../../repositories");

describe("ReleaseService", () => {
  let releaseService;
  let mockFindByVersion;
  let mockGetPaginated;

  let mockGetAllVersions;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFindByVersion = jest.fn();
    mockGetPaginated = jest.fn();
    mockGetAllVersions = jest.fn();

    ReleaseRepository.prototype.findByVersion = mockFindByVersion;
    ReleaseRepository.prototype.getPaginated = mockGetPaginated;
    ReleaseRepository.prototype.getAllVersions = mockGetAllVersions;

    releaseService = new ReleaseService();
  });

  describe("getReleaseByVersion", () => {
    it("queries ReleaseRepository for version", async () => {
      const dbRelease = {
        version: "v1.2.0",
        releaseDate: new Date("2026-09-01"),
        githubReleaseId: 100,
        entries: [],
      };
      mockFindByVersion.mockResolvedValue(dbRelease);

      const result = await releaseService.getReleaseByVersion("v1.2.0");

      expect(mockFindByVersion).toHaveBeenCalledWith("v1.2.0");
      expect(result).toEqual(dbRelease);
    });

    it("returns null when version is not in database", async () => {
      mockFindByVersion.mockResolvedValue(null);

      const result = await releaseService.getReleaseByVersion("v9.9.9");

      expect(mockFindByVersion).toHaveBeenCalledWith("v9.9.9");
      expect(result).toBeNull();
    });
  });

  describe("getAllReleases", () => {
    it("delegates to ReleaseRepository.getPaginated with provided parameters", async () => {
      const paginatedResult = {
        data: [{ version: "v1.0.0" }],
        total: 1,
        currentPage: 1,
        totalPages: 1,
      };
      mockGetPaginated.mockResolvedValue(paginatedResult);

      const result = await releaseService.getAllReleases(2, 5);

      expect(mockGetPaginated).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(paginatedResult);
    });

    it("uses default page=1 and limit=10 if not passed", async () => {
      mockGetPaginated.mockResolvedValue({
        data: [],
        total: 0,
        currentPage: 1,
        totalPages: 0,
      });

      await releaseService.getAllReleases();

      expect(mockGetPaginated).toHaveBeenCalledWith(1, 10);
    });
  });

  describe("getReleaseVersions", () => {
    it("delegates to ReleaseRepository.getAllVersions", async () => {
      const mockVersions = [
        { version: "0.8.0", releaseDate: "2026-05-15T00:00:00.000Z" },
        { version: "0.7.0", releaseDate: "2026-03-20T00:00:00.000Z" },
      ];
      mockGetAllVersions.mockResolvedValue(mockVersions);

      const result = await releaseService.getReleaseVersions();

      expect(mockGetAllVersions).toHaveBeenCalled();
      expect(result).toEqual(mockVersions);
    });
  });
});
