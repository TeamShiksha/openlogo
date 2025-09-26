const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");
const { MOCK_KEYS, MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

const {
  ImageService,
  KeyService,
  SubscriptionService,
} = require("../../../services");

describe("getLogoController", () => {
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

  const apiUrl = "/api/logo";

  const baseQuery = {
    API_KEY: MOCK_KEYS[1].key,
    key: "https://google.com",
  };

  const imageUrl = "https://cdn.myapp.com/png/GOOGLE.png?v=1755253230000";

  const mockSubscription = [MOCK_SUBSCRIPTION[0], MOCK_SUBSCRIPTION[1]];

  function mockRepetedService(mockSubscription) {
    const keyServiceMockResolve = MOCK_KEYS[0];

    jest
      .spyOn(KeyService.prototype, "getApiKey")
      .mockResolvedValue({ ...keyServiceMockResolve });

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(mockSubscription);
  }

  it("should return 422 if query validation fails", async () => {
    const wrongBaseQuery = {
      API_KEY: "28482DNDO483ND3",
      key: "https://google.com",
    };
    const response = await request(app).get(apiUrl).query(wrongBaseQuery);
    expect(response.status).toBe(422);
  });

  it("if API key is invalid it should return 403", async () => {
    jest.spyOn(KeyService.prototype, "getApiKey").mockResolvedValue(null);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.INVALID_KEY,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("if limit reached it should return 403", async () => {
    mockRepetedService(mockSubscription[1]);

    const response = await request(app).get(apiUrl).query(baseQuery);
    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.LIMIT_REACHED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("if image not found it should return 404", async () => {
    mockRepetedService(mockSubscription[0]);

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
    mockRepetedService(mockSubscription[0]);

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
