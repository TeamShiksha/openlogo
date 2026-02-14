const request = require("supertest");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");
const { MOCK_KEYS, MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

const {
  ImageService,
  KeyService,
  SubscriptionService,
  UserService,
} = require("../../../services");

describe("GET /api/logo (with resetSubscription middleware)", () => {
  const apiUrl = "/api/logo";

  const baseQuery = {
    API_KEY: MOCK_KEYS[1].key,
    key: "https://google.com",
  };

  const imageUrl = "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000";

  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
    process.env.KEY = "logos";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockValidKeyAndSubscription(subscriptionOverrides = {}) {
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
        ...subscriptionOverrides,
      });
  }

  it("422 if query missing", async () => {
    const res = await request(app).get(apiUrl);
    expect(res.status).toBe(422);
  });

  it("403 if API key invalid", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(null);

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.INVALID_KEY);
  });

  it("403 if API key expired", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue({
      ...MOCK_KEYS[0],
      expires_at: new Date(Date.now() - 10000),
    });

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.API_KEY_EXPIRED);
  });

  it("403 if usage limit reached", async () => {
    mockValidKeyAndSubscription({
      usage_count: 100,
      usage_limit: 100,
    });

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.LIMIT_REACHED);
  });

  it("403 if subscription expired", async () => {
    mockValidKeyAndSubscription({
      end_date: new Date(Date.now() - 10000),
    });

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(Messages.Subscription_Expired);
  });

  it("404 if image not found", async () => {
    mockValidKeyAndSubscription();

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockResolvedValue(null);

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(Messages.LOGO_NOT_FOUND);
  });

  it("200 success case", async () => {
    mockValidKeyAndSubscription();

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockResolvedValue(imageUrl);

    jest
      .spyOn(UserService.prototype, "logLogoRequestEntry")
      .mockResolvedValue({});

    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue({});

    const res = await request(app).get(apiUrl).query(baseQuery);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      statusCode: 200,
      data: imageUrl,
    });
  });
});

describe("getLogoController - Operations Order Test", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
    process.env.KEY = "logos";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const apiUrl = "/api/logo";

  it("should ensure image is fetched before usage count is incremented - operations order test", async () => {
    const operationsOrder = [];
    const imageUrl = "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000";

    const mockKeyRef = {
      subscription_id: "test_subscription_id",
      ...MOCK_KEYS[0],
      expires_at: new Date("2026-12-31T23:59:59Z"),
    };

    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(mockKeyRef);

    const mockSubscription = {
      usage_count: 5,
      usage_limit: 100,
      ...MOCK_SUBSCRIPTION[0],
    };

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(mockSubscription);

    jest
      .spyOn(ImageService.prototype, "fetchImageByCompanyFree")
      .mockImplementation(() => {
        operationsOrder.push("image_fetched");
        return imageUrl;
      });
    jest
      .spyOn(UserService.prototype, "logLogoRequestEntry")
      .mockResolvedValue({});
    jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockImplementation(() => {
        operationsOrder.push("usage_count_incremented");
        return Promise.resolve();
      });

    const baseQuery = {
      API_KEY: MOCK_KEYS[1].key,
      key: "https://google.com",
    };

    const response = await request(app).get(apiUrl).query(baseQuery);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: imageUrl,
    });

    expect(operationsOrder).toEqual([
      "image_fetched",
      "usage_count_incremented",
    ]);
    expect(operationsOrder[0]).toBe("image_fetched");
    expect(operationsOrder[1]).toBe("usage_count_incremented");
  });
});
