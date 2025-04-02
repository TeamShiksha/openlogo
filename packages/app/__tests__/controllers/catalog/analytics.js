const request = require("supertest");
const {
  UserService,
  KeyService,
  RequestService,
  SubscriptionService,
} = require("../../../services");
const app = require("../../../server");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MOCK_ANALYTICS_DATA } = require("../../../utils/mocks");

jest.mock("jsonwebtoken");
jwt.verify = jest.fn(() => ({ userId: new mongoose.Types.ObjectId() }));

describe("GET /api/catalog/stats", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "jwtsecret";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
    delete process.env.JWT_SECRET;
  });

  it("200 - Returns analytics data successfully", async () => {
    jest
      .spyOn(UserService.prototype, "getUsersCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA.userCount);
    jest
      .spyOn(KeyService.prototype, "getKeysCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA.keyCount);
    jest
      .spyOn(RequestService.prototype, "getRequestsCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA.requestCount);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscriptionUsageCount")
      .mockResolvedValue(MOCK_ANALYTICS_DATA.hitCount);

    const response = await request(app).get("/api/catalog/stats");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: MOCK_ANALYTICS_DATA,
    });
  });
});
