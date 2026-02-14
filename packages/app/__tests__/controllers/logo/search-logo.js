const request = require("supertest");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");
const { MOCK_KEYS, MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

const {
  ImageService,
  KeyService,
  SubscriptionService,
} = require("../../../services");
describe("GET /api/logo/search (route-level)", () => {
  const apiUrl = "/api/logo/search";

  const baseQuery = {
    API_KEY: MOCK_KEYS[1].key,
    key: "https://google.com",
  };

  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockValidKeyAndSubscription(overrides = {}) {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue({
      ...MOCK_KEYS[2],
      subscription_id: "sub_id",
      expires_at: new Date("2026-12-31T23:59:59Z"),
    });

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({
        ...MOCK_SUBSCRIPTION[0],
        usage_count: 5,
        usage_limit: 100,
        end_date: new Date("2026-12-31T23:59:59Z"),
        ...overrides,
      });
  }

  // 422 - missing query
  it("should return 422 if query missing", async () => {
    const res = await request(app).get(apiUrl);
    expect(res.status).toBe(422);
  });

  // 403 - invalid key
  it("should return 403 if API key invalid", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(null);

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.INVALID_KEY);
  });

  // 403 - expired key
  it("should return 403 if API key expired", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue({
      ...MOCK_KEYS[0],
      expires_at: new Date(Date.now() - 10000),
    });

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.API_KEY_EXPIRED);
  });

  // 403 - limit reached
  it("should return 403 if usage limit reached", async () => {
    mockValidKeyAndSubscription({
      usage_count: 100,
      usage_limit: 100,
    });

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.LIMIT_REACHED);
  });

  // 404 - company not found
  it("should return 404 if no company found", async () => {
    mockValidKeyAndSubscription();

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue([]);

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(Messages.LOGO_NOT_FOUND);
  });

  // 200 - success
  it("should return 200 on success", async () => {
    mockValidKeyAndSubscription();

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockResolvedValue([{ _id: "123", company_name: "GOOGLE" }]);

    jest
      .spyOn(ImageService.prototype, "getDataList")
      .mockResolvedValue([{ _id: "123", image: "url" }]);

    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue();

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body.statusCode).toBe(200);
  });

  // 500 - unexpected error
  it("should return 500 on unexpected error", async () => {
    mockValidKeyAndSubscription();

    jest
      .spyOn(ImageService.prototype, "fetchCompanyList")
      .mockRejectedValue(new Error("Boom"));

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(500);
  });
});
