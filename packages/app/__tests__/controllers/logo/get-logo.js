const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");

const {
  ImageService,
  KeyService,
  SubscriptionService,
} = require("../../../services");

describe("getLogoController", () => {
  const apiUrl = "/api/logo";

  const wrongBaseQuery = {
    API_KEY: "3fa85f64-5717-4562-b3fc-2c963f66afa5",
    domain: "google.com",
  };

  const baseQuery = {
    API_KEY: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    domain: "google.com",
  };

  const imageUrl =
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b0d0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";

  function mockRepetedService(usage_count, usage_limit) {
    const keyServiceMockResolve = {
      _id: "1234",
      key: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      key_description: "API-KEY-1",
      subscription_id: "mockSubscriptionID@123",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const mockSubscription = {
      _id: "1234",
      subscription_id: "mockSubscriptionID@123",
      usage_count,
      usage_limit,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    jest
      .spyOn(KeyService.prototype, "getApiKey")
      .mockResolvedValue({ ...keyServiceMockResolve });

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(mockSubscription);
  }

  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
    process.env.KEY = "logos";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  it("should return 422 if empty query", async () => {
    const response = await request(app).get(apiUrl).query({});
    expect(response.status).toBe(422);
  });

  it("if API key is invalid it should return 403", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(null);

    const response = await request(app).get(apiUrl).query(wrongBaseQuery);
    expect(response.status).toBe(403);
  });
  // duplicate mocking
  it("if limit reached it should return 403", async () => {
    mockRepetedService(10, 10);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.LIMIT_REACHED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("if image not found it should return 404", async () => {
    mockRepetedService(9, 10);

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockResolvedValue(null);

    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue([]);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.LOGO_NOT_FOUND,
      statusCode: 404,
      error: STATUS_CODES[404],
    });
  });

  it("200-images returned", async () => {
    mockRepetedService(9, 10);

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockResolvedValue(imageUrl);

    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue([]);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: imageUrl,
    });
  });

  it("500-unexpected error", async () => {
    mockRepetedService(9, 10);

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockResolvedValue(imageUrl);

    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockImplementation(() => {
        throw new Error("Boom!");
      });

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(500);
  });
});
