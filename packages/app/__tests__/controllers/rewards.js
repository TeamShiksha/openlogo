const request = require("supertest");
const { STATUS_CODES } = require("http");
const { RewardsService } = require("../../services");
const {
  MOCK_USERS,
  MOCK_IMAGES,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
  MOCK_REWARD_TRANSACTION,
  MOCK_REWARD_TRANSACTIONS_LIST,
  MOCK_USER_TRANSACTION_STATS,
  MOCK_BONUS_POINTS_AWARD,
  MOCK_AUDIT_TRAIL_LIST,
  MOCK_TRANSACTION_SEARCH_RESPONSE,
} = require("../../utils/mocks");
const { UserSessionService } = require("../../services");
const app = require("../../server");

jest.mock("../../services/rewards");
jest.mock("../../services/userSession");

describe.skip("Rewards Controller", () => {
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

  describe("getRewardSummaryForImageController", () => {
    const imageId = MOCK_IMAGES[0]._id.toString();
    const endpoint = `/api/rewards/summary/image/${imageId}`;

    it("404 - No reward data found for this image", async () => {
      jest
        .spyOn(RewardsService.prototype, "getRewardSummaryForImage")
        .mockResolvedValue(null);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "No reward data found for this image",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    });

    it("200 - Returns reward summary for image", async () => {
      const mockSummary = {
        imageId,
        imageName: "Test Logo",
        creator: {
          id: MOCK_USERS[0]._id,
          name: MOCK_USERS[0].name,
          email: MOCK_USERS[0].email,
        },
        uniqueProUsersCount: 10,
        uniqueProUsers: [MOCK_USERS[1]._id, MOCK_USERS[2]._id],
        totalPointsAwarded: 50,
        milestonesAchieved: [
          { milestone: 5, points: 25 },
          { milestone: 10, points: 25 },
        ],
        nextMilestone: 15,
      };

      jest
        .spyOn(RewardsService.prototype, "getRewardSummaryForImage")
        .mockResolvedValue(mockSummary);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.imageId).toBe(imageId);
      expect(response.body.data.imageName).toBe("Test Logo");
      expect(response.body.data.uniqueProUsersCount).toBe(10);
      expect(response.body.data.totalPointsAwarded).toBe(50);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(RewardsService.prototype, "getRewardSummaryForImage")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(500);
    });
  });

  describe("getRewardSummaryForUserController", () => {
    const endpoint = `/api/rewards/summary/user`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it("404 - User not found", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserRewardData")
        .mockResolvedValue(null);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(404);
      expect(response.body.statusCode).toBe(404);
      expect(response.body.error).toBe(STATUS_CODES[404]);
    });

    it("200 - Returns user reward summary", async () => {
      const mockUserRewardData = {
        userId: MOCK_USERS[0]._id,
        userName: MOCK_USERS[0].name,
        email: MOCK_USERS[0].email,
        currentPoints: 100,
        lifetimePoints: 500,
        totalImages: 2,
        totalPointsAwarded: 200,
        averagePointsPerImage: 100,
        rewards: [
          {
            imageId: MOCK_IMAGES[0]._id,
            uniqueProUsersCount: 10,
            totalPointsAwarded: 100,
            milestonesAchieved: 2,
          },
          {
            imageId: MOCK_IMAGES[1]._id,
            uniqueProUsersCount: 5,
            totalPointsAwarded: 100,
            milestonesAchieved: 1,
          },
        ],
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserRewardData")
        .mockResolvedValue(mockUserRewardData);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.currentPoints).toBe(100);
      expect(response.body.data.lifetimePoints).toBe(500);
      expect(response.body.data.totalImages).toBe(2);
      expect(response.body.data.totalPointsAwarded).toBe(200);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserRewardData")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(500);
    });
  });

  describe("getRewardsLeaderboardController", () => {
    const endpoint = `/api/rewards/leaderboard`;

    it("200 - Returns leaderboard with default limit", async () => {
      const mockLeaderboard = [
        {
          rank: 1,
          userId: MOCK_USERS[0]._id,
          name: MOCK_USERS[0].name,
          email: MOCK_USERS[0].email,
          uniqueProUsersCount: 50,
          totalPointsAwarded: 500,
          milestonesAchieved: 10,
        },
        {
          rank: 2,
          userId: MOCK_USERS[1]._id,
          name: MOCK_USERS[1].name,
          email: MOCK_USERS[1].email,
          uniqueProUsersCount: 40,
          totalPointsAwarded: 400,
          milestonesAchieved: 8,
        },
      ];

      jest
        .spyOn(RewardsService.prototype, "getRewardsLeaderboard")
        .mockResolvedValue(mockLeaderboard);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].rank).toBe(1);
      expect(response.body.data[0].totalPointsAwarded).toBe(500);
      expect(
        RewardsService.prototype.getRewardsLeaderboard
      ).toHaveBeenCalledWith(10);
    });

    it("200 - Returns leaderboard with custom limit", async () => {
      const mockLeaderboard = [
        {
          rank: 1,
          name: "Creator 5",
          totalPointsAwarded: 500,
        },
      ];

      jest
        .spyOn(RewardsService.prototype, "getRewardsLeaderboard")
        .mockResolvedValue(mockLeaderboard);

      const response = await request(app).get(`${endpoint}?limit=2`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(
        RewardsService.prototype.getRewardsLeaderboard
      ).toHaveBeenCalledWith(2);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(RewardsService.prototype, "getRewardsLeaderboard")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(500);
    });
  });

  describe("getImageTransactionsController", () => {
    const imageId = MOCK_IMAGES[0]._id.toString();
    const endpoint = `/api/rewards/transactions/image/${imageId}`;

    it("200 - Returns image transactions with default pagination", async () => {
      const mockTransactions = {
        data: MOCK_REWARD_TRANSACTIONS_LIST.slice(0, 2),
        total: 3,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      jest
        .spyOn(RewardsService.prototype, "getImageTransactions")
        .mockResolvedValue(mockTransactions);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.total).toBe(3);
      expect(response.body.data.page).toBe(1);
      expect(
        RewardsService.prototype.getImageTransactions
      ).toHaveBeenCalledWith(imageId, 1, 20);
    });

    it("200 - Returns image transactions with custom pagination", async () => {
      const mockTransactions = {
        data: MOCK_REWARD_TRANSACTIONS_LIST.slice(0, 1),
        total: 3,
        page: 2,
        limit: 10,
        totalPages: 1,
      };

      jest
        .spyOn(RewardsService.prototype, "getImageTransactions")
        .mockResolvedValue(mockTransactions);

      const response = await request(app).get(`${endpoint}?page=2&limit=10`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(
        RewardsService.prototype.getImageTransactions
      ).toHaveBeenCalledWith(imageId, 2, 10);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(RewardsService.prototype, "getImageTransactions")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(500);
    });
  });

  describe("getUserTransactionsController", () => {
    const endpoint = `/api/rewards/transactions/user`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it("200 - Returns user transactions with default pagination", async () => {
      const mockTransactions = {
        data: MOCK_REWARD_TRANSACTIONS_LIST.slice(0, 2),
        total: 3,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserTransactions")
        .mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.total).toBe(3);
    });

    it("200 - Returns user transactions with custom pagination", async () => {
      const mockTransactions = {
        data: [MOCK_REWARD_TRANSACTIONS_LIST[0]],
        total: 3,
        page: 2,
        limit: 10,
        totalPages: 1,
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserTransactions")
        .mockResolvedValue(mockTransactions);

      const response = await request(app)
        .get(`${endpoint}?page=2&limit=10`)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserTransactions")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(500);
    });
  });

  describe("getTransactionController", () => {
    const transactionId = MOCK_REWARD_TRANSACTION._id.toString();
    const endpoint = `/api/rewards/transactions/${transactionId}`;

    it("404 - Transaction not found", async () => {
      jest
        .spyOn(RewardsService.prototype, "getTransaction")
        .mockResolvedValue(null);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        message: "Transaction not found",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    });

    it("200 - Returns transaction details", async () => {
      jest
        .spyOn(RewardsService.prototype, "getTransaction")
        .mockResolvedValue(MOCK_REWARD_TRANSACTION);

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.points_earned).toBe(10);
      expect(response.body.data.points_type).toBe("USAGE_REWARD");
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(RewardsService.prototype, "getTransaction")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app).get(endpoint);

      expect(response.status).toBe(500);
    });
  });

  describe("getUserTransactionStatsController", () => {
    const endpoint = `/api/rewards/transactions/stats/user`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it("200 - Returns user transaction statistics", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserTransactionStats")
        .mockResolvedValue(MOCK_USER_TRANSACTION_STATS);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.totalPointsEarned).toBe(150);
      expect(response.body.data.currentBalance).toBe(140);
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getUserTransactionStats")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(500);
    });
  });

  describe("getAuditTrailController", () => {
    const imageId = MOCK_IMAGES[0]._id.toString();
    const endpoint = `/api/rewards/audit-trail/${imageId}`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it("200 - Returns audit trail for image", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getAuditTrail")
        .mockResolvedValue(MOCK_AUDIT_TRAIL_LIST);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(3);
      expect(response.body.data[0].action).toBe("POINTS_AWARDED");
    });

    it("500 - Service throws an error", async () => {
      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(MOCK_USER_SESSIONS[0]);
      jest
        .spyOn(RewardsService.prototype, "getAuditTrail")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(500);
    });
  });

  describe("searchTransactionsController", () => {
    const endpoint = `/api/rewards/transactions/search`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).get(endpoint);

      expect(response.status).toBe(401);
    });

    it("401 - User is not an admin", async () => {
      const nonAdminSession = {
        userId: MOCK_USERS[0], // Use regular user, not admin
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(nonAdminSession);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(401);
    });

    it("200 - Returns search results with default pagination", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "searchTransactions")
        .mockResolvedValue(MOCK_TRANSACTION_SEARCH_RESPONSE);

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.data).toBeDefined();
    });

    it("200 - Returns filtered search results", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "searchTransactions")
        .mockResolvedValue(MOCK_TRANSACTION_SEARCH_RESPONSE);

      const userId = MOCK_USERS[0]._id.toString();
      const response = await request(app)
        .get(`${endpoint}?userId=${userId}&type=BONUS`)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
    });

    it("500 - Service throws an error", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "searchTransactions")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

      expect(response.status).toBe(500);
    });
  });

  describe("awardBonusPointsController", () => {
    const endpoint = `/api/rewards/bonus`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).post(endpoint).send({
        imageId: MOCK_IMAGES[0]._id.toString(),
        userId: MOCK_USERS[0]._id.toString(),
        points: 50,
      });

      expect(response.status).toBe(401);
    });

    it("401 - User is not an admin", async () => {
      const nonAdminSession = {
        userId: MOCK_USERS[0], // Regular user, not admin
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(nonAdminSession);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          imageId: MOCK_IMAGES[0]._id.toString(),
          userId: MOCK_USERS[0]._id.toString(),
          points: 50,
        });

      expect(response.status).toBe(401);
    });

    it("400 - Missing required fields", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          imageId: MOCK_IMAGES[0]._id.toString(),
          // missing userId and points
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Missing required fields");
    });

    it("400 - Points must be greater than 0", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          imageId: MOCK_IMAGES[0]._id.toString(),
          userId: MOCK_USERS[0]._id.toString(),
          points: -5, // Negative points
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Points must be greater than 0");
    });

    it("201 - Bonus points awarded successfully", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "awardBonusPoints")
        .mockResolvedValue(MOCK_BONUS_POINTS_AWARD);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          imageId: MOCK_IMAGES[0]._id.toString(),
          userId: MOCK_USERS[0]._id.toString(),
          points: 50,
          reason: "Referral bonus",
          description: "Bonus for referral program",
        });

      expect(response.status).toBe(201);
      expect(response.body.statusCode).toBe(201);
      expect(response.body.message).toBe("Bonus points awarded successfully");
      expect(response.body.data.success).toBe(true);
      expect(response.body.data.pointsAwarded).toBe(50);
      expect(response.body.data.newBalance).toBe(190);
    });

    it("500 - Service throws an error", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "awardBonusPoints")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          imageId: MOCK_IMAGES[0]._id.toString(),
          userId: MOCK_USERS[0]._id.toString(),
          points: 50,
        });

      expect(response.status).toBe(500);
    });
  });

  describe("reverseTransactionController", () => {
    const transactionId = MOCK_REWARD_TRANSACTION._id.toString();
    const endpoint = `/api/rewards/transactions/${transactionId}/reverse`;

    it("401 - User not authenticated", async () => {
      const response = await request(app).post(endpoint).send({
        reason: "System error",
      });

      expect(response.status).toBe(401);
    });

    it("401 - User is not an admin", async () => {
      const nonAdminSession = {
        userId: MOCK_USERS[0], // Regular user, not admin
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(nonAdminSession);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          reason: "System error",
        });

      expect(response.status).toBe(401);
    });

    it("400 - Reversal reason is required", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          // missing reason
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("Reversal reason is required");
    });

    it("200 - Transaction reversed successfully", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      const mockReversedTransaction = {
        ...MOCK_REWARD_TRANSACTION,
        is_reversed: true,
        reversed_at: new Date(),
        reversal_reason: "System error",
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "reverseTransaction")
        .mockResolvedValue(mockReversedTransaction);

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          reason: "System error",
        });

      expect(response.status).toBe(200);
      expect(response.body.statusCode).toBe(200);
      expect(response.body.message).toBe("Transaction reversed successfully");
      expect(response.body.data.is_reversed).toBe(true);
    });

    it("500 - Service throws an error", async () => {
      const adminSession = {
        userId: MOCK_USERS[2], // Admin user
      };

      jest
        .spyOn(UserSessionService.prototype, "validateSession")
        .mockResolvedValue(adminSession);
      jest
        .spyOn(RewardsService.prototype, "reverseTransaction")
        .mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post(endpoint)
        .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
        .send({
          reason: "System error",
        });

      expect(response.status).toBe(500);
    });
  });
});
