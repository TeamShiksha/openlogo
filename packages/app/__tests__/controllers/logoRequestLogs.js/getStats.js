const request = require("supertest");
const { STATUS_CODES } = require("node:http");

const { LogoRequestLogsService } = require("../../../services");
const {
  MOCK_USERS,
  MOCK_WEEKLY_STATS,
  MOCK_MONTHLY_STATS,
} = require("../../../utils/mocks");
const { Users } = require("../../../models");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("GET LOGO REQUEST STATS", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  describe("Weekly Stats", () => {
    it.skip("200 - should return last 7 days stats for authenticated user", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getWeeklyStats")
        .mockResolvedValue(MOCK_WEEKLY_STATS);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=week")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: MOCK_WEEKLY_STATS,
      });
      expect(
        LogoRequestLogsService.prototype.getWeeklyStats
      ).toHaveBeenCalledWith(mockUserModel._id.toString());
    });

    it.skip("200 - should return empty stats when user has no requests in last 7 days", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const emptyStats = {
        period: "week",
        startDate: "2025-11-24",
        endDate: "2025-12-01",
        summary: {
          totalCount: 0,
          totalKB: "0.00",
        },
        data: [],
      };

      jest
        .spyOn(LogoRequestLogsService.prototype, "getWeeklyStats")
        .mockResolvedValue(emptyStats);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=week")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.summary.totalCount).toBe(0);
      expect(response.body.data.data).toEqual([]);
    });
  });

  describe("Monthly Stats", () => {
    it.skip("200 - should return last 30 days stats for authenticated user", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getMonthlyStats")
        .mockResolvedValue(MOCK_MONTHLY_STATS);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=month")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        statusCode: 200,
        data: MOCK_MONTHLY_STATS,
      });
      expect(
        LogoRequestLogsService.prototype.getMonthlyStats
      ).toHaveBeenCalledWith(mockUserModel._id.toString());
    });

    it.skip("200 - should return empty stats when user has no requests in last 30 days", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const emptyStats = {
        period: "month",
        startDate: "2025-11-01",
        endDate: "2025-12-01",
        summary: {
          totalCount: 0,
          totalKB: "0.00",
        },
        data: [],
      };

      jest
        .spyOn(LogoRequestLogsService.prototype, "getMonthlyStats")
        .mockResolvedValue(emptyStats);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=month")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.summary.totalCount).toBe(0);
      expect(response.body.data.data).toEqual([]);
    });
  });

  describe("Validation Errors", () => {
    it.skip("422 - should return validation error when period parameter is missing", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const response = await request(app)
        .get("/api/logo-requests/stats")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(422);
      expect(response.body.statusCode).toBe(422);
      expect(response.body.error).toBe(STATUS_CODES[422]);
      expect(response.body.message).toContain("Period is required");
    });

    it.skip("422 - should return validation error when period parameter is invalid", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const response = await request(app)
        .get("/api/logo-requests/stats?period=invalid")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(422);
      expect(response.body.statusCode).toBe(422);
      expect(response.body.error).toBe(STATUS_CODES[422]);
      expect(response.body.message).toContain(
        "Period must be either 'week' or 'month'"
      );
    });

    it.skip("422 - should return validation error for empty period parameter", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const response = await request(app)
        .get("/api/logo-requests/stats?period=")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(422);
      expect(response.body.statusCode).toBe(422);
      expect(response.body.error).toBe(STATUS_CODES[422]);
    });
  });

  describe("Error Handling", () => {
    it.skip("404 - should return not found when stats are null", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getWeeklyStats")
        .mockResolvedValue(null);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=week")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.DATA_NOT_FOUND,
      });
    });

    it.skip("404 - should return not found when monthly stats are null", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getMonthlyStats")
        .mockResolvedValue(null);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=month")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.DATA_NOT_FOUND,
      });
    });

    it.skip("500 - should handle unexpected errors during weekly stats fetch", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getWeeklyStats")
        .mockImplementation(() => {
          throw new Error("Unexpected database error");
        });

      const response = await request(app)
        .get("/api/logo-requests/stats?period=week")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(500);
    });

    it.skip("500 - should handle unexpected errors during monthly stats fetch", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getMonthlyStats")
        .mockImplementation(() => {
          throw new Error("Unexpected database error");
        });

      const response = await request(app)
        .get("/api/logo-requests/stats?period=month")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe("Authentication", () => {
    it("401 - should return unauthorized when JWT token is missing", async () => {
      const response = await request(app).get(
        "/api/logo-requests/stats?period=week"
      );

      expect(response.status).toBe(401);
    });

    it.skip("500 - should return error when JWT token is invalid", async () => {
      const response = await request(app)
        .get("/api/logo-requests/stats?period=week")
        .set("Cookie", `jwt=invalid_token`);

      expect(response.status).toBe(500);
    });
  });

  describe("Edge Cases", () => {
    it.skip("should handle case-sensitive period parameter", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      const response = await request(app)
        .get("/api/logo-requests/stats?period=Week")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(422);
      expect(response.body.message).toContain(
        "Period must be either 'week' or 'month'"
      );
    });

    it.skip("should handle additional query parameters gracefully", async () => {
      const mockUserModel = new Users(MOCK_USERS[1]);
      const mockToken = mockUserModel.generateJWT();

      jest
        .spyOn(LogoRequestLogsService.prototype, "getWeeklyStats")
        .mockResolvedValue(MOCK_WEEKLY_STATS);

      const response = await request(app)
        .get("/api/logo-requests/stats?period=week&extra=param")
        .set("Cookie", `jwt=${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual(MOCK_WEEKLY_STATS);
    });
  });
});
