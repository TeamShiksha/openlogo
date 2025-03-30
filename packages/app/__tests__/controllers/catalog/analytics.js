const request = require("supertest");
const { STATUS_CODES } = require("http");
const {
  UserService,
  KeyService,
  RequestService,
  SubscriptionService,
} = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const { MOCK_ANALYTICS_DATA } = require("../../../utils/mocks");

describe("GET /api/catalog/stats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.exit(0);
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

  it("500 - Internal Server Error when any count service fails", async () => {
    jest.spyOn(UserService.prototype, "getUsersCount").mockResolvedValue(null);

    const response = await request(app).get("/api/catalog/stats");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: Messages.INTERNAL_SERVER_ERROR,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Unexpected Error", async () => {
    jest
      .spyOn(UserService.prototype, "getUsersCount")
      .mockImplementation(() => {
        throw new Error("Unexpected error");
      });

    const response = await request(app).get("/api/catalog/stats");

    expect(response.status).toBe(500);
  });
});
