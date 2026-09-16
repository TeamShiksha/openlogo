const request = require("supertest");
const { Readable } = require("stream");
const { STATUS_CODES } = require("node:http");
const app = require("../../../server");
const { Messages } = require("../../../utils/constants");
const { MOCK_SUBSCRIPTION, MOCK_IMAGES } = require("../../../utils/mocks");

const {
  ImageService,
  KeyService,
  SubscriptionService,
  UserService,
} = require("../../../services");

jest.mock("../../../services/rewardTransactions");

describe("getLogoImageController", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://localhost:3000";
    process.env.KEY = "logos";
    process.env.BUCKET_NAME = "test-bucket";
    process.env.BUCKET_KEY = "logos";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
    delete process.env.KEY;
    delete process.env.BUCKET_NAME;
    delete process.env.BUCKET_KEY;
  });

  const apiUrl = "/api/logo/image";
  const validPublishableKey = "pk_test123456";
  const validOrigin = "https://example.com";

  const mockPublishableKeyRef = {
    _id: "6826d68a0fbea0d79998ef44",
    publishable_key: validPublishableKey,
    key_type: "PUBLISHABLE",
    key_description: "Test Publishable Key",
    allowed_origins: ["https://example.com", "https://app.example.com"],
    is_origin_restricted: true,
    is_active: true,
    subscription_id: "test_subscription_id",
    expires_at: new Date("2030-12-31T23:59:59Z"),
  };

  const mockImageDoc = {
    ...MOCK_IMAGES[0],
    company_name: "GOOGLE",
    extension: "png",
    image_size: 1024,
  };

  function createMockStream(content = "fake-png-binary-data") {
    const stream = new Readable();
    stream.push(Buffer.from(content));
    stream.push(null);
    return stream;
  }

  it("should return 401 if PUBLISHABLE_KEY is missing", async () => {
    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: Messages.INVALID_PUBLISHABLE_KEY,
      statusCode: 401,
      error: STATUS_CODES[401],
    });
  });

  it("should return 422 if key is empty/invalid", async () => {
    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ PUBLISHABLE_KEY: validPublishableKey, key: "" });

    expect(response.status).toBe(422);
  });

  it("should return 401 if publishable key does not exist", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(null);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com", PUBLISHABLE_KEY: "pk_invalid" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: Messages.INVALID_PUBLISHABLE_KEY,
      statusCode: 401,
      error: STATUS_CODES[401],
    });
  });

  it("should return 401 if publishable key is inactive", async () => {
    jest.spyOn(KeyService.prototype, "getPublishableKey").mockResolvedValue({
      ...mockPublishableKeyRef,
      is_active: false,
    });

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: Messages.INVALID_PUBLISHABLE_KEY,
      statusCode: 401,
      error: STATUS_CODES[401],
    });
  });

  it("should return 401 if publishable key is expired", async () => {
    jest.spyOn(KeyService.prototype, "getPublishableKey").mockResolvedValue({
      ...mockPublishableKeyRef,
      expires_at: new Date(Date.now() - 86400000),
    });

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      message: Messages.API_KEY_EXPIRED,
      statusCode: 401,
      error: STATUS_CODES[401],
    });
  });

  it("should return 403 if Origin header is missing", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 if Origin is not in allowed_origins", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "https://unauthorized-domain.com")
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 for suffix attacker attempt (https://example.com.attacker.com)", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "https://example.com.attacker.com")
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 for prefix attacker attempt (https://attacker-example.com)", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "https://attacker-example.com")
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 for subdomain if not explicitly allowed", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "https://sub.example.com")
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 for protocol mismatch (http vs https)", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "http://example.com")
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.ORIGIN_NOT_ALLOWED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 403 if subscription usage limit is reached", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[1]); // usage_count: 500, usage_limit: 500

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      message: Messages.LIMIT_REACHED,
      statusCode: 403,
      error: STATUS_CODES[403],
    });
  });

  it("should return 404 if logo is not found in database", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[0]);

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(null);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "nonexistent.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.LOGO_NOT_FOUND,
      statusCode: 404,
      error: STATUS_CODES[404],
    });
  });

  it("should return 404 if S3 storage retrieval throws an error", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[0]);

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(mockImageDoc);

    jest
      .spyOn(ImageService.prototype, "getImageStream")
      .mockRejectedValue(new Error("S3 NoSuchKey"));

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", validOrigin)
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.LOGO_NOT_FOUND,
      statusCode: 404,
      error: STATUS_CODES[404],
    });
  });

  it("should return 200 with direct binary image and correct CORS headers on success", async () => {
    jest
      .spyOn(KeyService.prototype, "getPublishableKey")
      .mockResolvedValue(mockPublishableKeyRef);

    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[0]);

    jest
      .spyOn(ImageService.prototype, "getImageByCompanyName")
      .mockResolvedValue(mockImageDoc);

    const mockStream = createMockStream("<svg>Google Logo</svg>");
    jest.spyOn(ImageService.prototype, "getImageStream").mockResolvedValue({
      stream: mockStream,
      contentType: "image/svg+xml",
      contentLength: 22,
    });

    const logEntrySpy = jest
      .spyOn(UserService.prototype, "logLogoRequestEntry")
      .mockResolvedValue({});

    const incrementSpy = jest
      .spyOn(SubscriptionService.prototype, "incrementUsageCount")
      .mockResolvedValue([]);

    const response = await request(app)
      .get(apiUrl)
      .set("Origin", "https://example.com/") // Test trailing slash normalization
      .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/svg+xml");
    expect(response.headers["access-control-allow-origin"]).toBe(
      "https://example.com"
    );
    expect(response.headers["access-control-allow-origin"]).not.toBe("*");
    expect(response.headers["vary"]).toBe("Origin");
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    const responseContent = response.text || response.body.toString();
    expect(responseContent).toBe("<svg>Google Logo</svg>");

    expect(logEntrySpy).toHaveBeenCalled();
    expect(incrementSpy).toHaveBeenCalled();
  });

  describe("when is_origin_restricted is false (unrestricted mode)", () => {
    const mockUnrestrictedPublishableKeyRef = {
      ...mockPublishableKeyRef,
      allowed_origins: [],
      is_origin_restricted: false,
    };

    it("should succeed and reflect Origin in Access-Control-Allow-Origin when Origin header is present", async () => {
      jest
        .spyOn(KeyService.prototype, "getPublishableKey")
        .mockResolvedValue(mockUnrestrictedPublishableKeyRef);

      jest
        .spyOn(SubscriptionService.prototype, "getSubscription")
        .mockResolvedValue(MOCK_SUBSCRIPTION[0]);

      jest
        .spyOn(ImageService.prototype, "getImageByCompanyName")
        .mockResolvedValue(mockImageDoc);

      const mockStream = createMockStream("<svg>Google Logo</svg>");
      jest.spyOn(ImageService.prototype, "getImageStream").mockResolvedValue({
        stream: mockStream,
        contentType: "image/svg+xml",
        contentLength: 22,
      });

      const response = await request(app)
        .get(apiUrl)
        .set("Origin", "https://any-arbitrary-domain.com")
        .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBe(
        "https://any-arbitrary-domain.com"
      );
      expect(response.headers["access-control-allow-origin"]).not.toBe("*");
      expect(response.headers["vary"]).toBe("Origin");
    });

    it("should succeed without setting Access-Control-Allow-Origin when Origin header is absent", async () => {
      jest
        .spyOn(KeyService.prototype, "getPublishableKey")
        .mockResolvedValue(mockUnrestrictedPublishableKeyRef);

      jest
        .spyOn(SubscriptionService.prototype, "getSubscription")
        .mockResolvedValue(MOCK_SUBSCRIPTION[0]);

      jest
        .spyOn(ImageService.prototype, "getImageByCompanyName")
        .mockResolvedValue(mockImageDoc);

      const mockStream = createMockStream("<svg>Google Logo</svg>");
      jest.spyOn(ImageService.prototype, "getImageStream").mockResolvedValue({
        stream: mockStream,
        contentType: "image/svg+xml",
        contentLength: 22,
      });

      const response = await request(app)
        .get(apiUrl)
        .query({ key: "google.com", PUBLISHABLE_KEY: validPublishableKey });

      expect(response.status).toBe(200);
      expect(response.headers["access-control-allow-origin"]).toBeUndefined();
      expect(response.headers["access-control-allow-origin"]).not.toBe("*");
      expect(response.headers["content-type"]).toBe("image/svg+xml");
      const responseContent = response.text || response.body.toString();
      expect(responseContent).toBe("<svg>Google Logo</svg>");
    });
  });
});
