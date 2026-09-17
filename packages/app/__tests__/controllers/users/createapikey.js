const request = require("supertest");
const { STATUS_CODES } = require("http");
const {
  MOCK_USERS,
  MOCK_KEYS,
  MOCK_KEYS_VALIDITY_PERIOD,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
} = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const {
  UserService,
  SubscriptionService,
  KeyService,
  UserSessionService,
} = require("../../../services");
const app = require("../../../server");

describe("Generate User Key", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("422 - Key Description must contain only alphabets and spaces", async () => {
    const mockInput = {
      key_description: "Description@1234",
      expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
    };

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "Description must contain only alphabets and spaces",
      error: STATUS_CODES[422],
    });
  });

  it("404 - User not found", async () => {
    const mockInput = {
      key_description: MOCK_KEYS[1].keyDescription,
      expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneMonth,
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("403 - Limit reached for SECRET key", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [
        { key_description: MOCK_KEYS[0].key_description },
        { key_description: MOCK_KEYS[2].key_description },
      ],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 2, publishable_key_limit: 2 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { key_description: MOCK_KEYS[0].key_description, key_type: "SECRET" },
      { key_description: MOCK_KEYS[2].key_description, key_type: "SECRET" },
    ]);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: MOCK_KEYS[1].keyDescription,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
        key_type: "SECRET",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: Messages.LIMIT_REACHED,
      error: STATUS_CODES[403],
    });
  });

  it("500 - Unexpected Error", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [
        { key_description: MOCK_KEYS[1].keyDescription },
        { key_description: MOCK_KEYS[2].keyDescription },
      ],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });
    jest
      .spyOn(KeyService.prototype, "getAllUserKeys")
      .mockResolvedValue([
        { key_description: MOCK_KEYS[1].keyDescription },
        { key_description: MOCK_KEYS[2].keyDescription },
      ]);
    jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: MOCK_KEYS[1].keyDescription,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].threeMonths,
      });

    expect(response.status).toBe(500);
  });

  it("200 - Key generated ", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [
        { key_description: MOCK_KEYS[1].keyDescription },
        { key_description: MOCK_KEYS[2].keyDescription },
      ],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });
    jest
      .spyOn(KeyService.prototype, "getAllUserKeys")
      .mockResolvedValue([
        { key_description: MOCK_KEYS[1].keyDescription },
        { key_description: MOCK_KEYS[2].keyDescription },
      ]);
    jest.spyOn(UserService.prototype, "createNewUserKey").mockResolvedValue({
      data: {
        key_description: MOCK_KEYS[1].keyDescription,
        subscription_id: "07f1f77bcf86cd799439014",
        expires_at: "2025-12-16T20:20:00.000Z",
      },
    });

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: MOCK_KEYS[1].keyDescription,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: {
        data: {
          key_description: MOCK_KEYS[1].keyDescription,
          subscription_id: "07f1f77bcf86cd799439014",
          expires_at: "2025-12-16T20:20:00.000Z",
        },
      },
    });
  });

  it("200 - Publishable key generated (unrestricted)", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });

    const createdKeyResult = {
      _id: "6826d68a0fbea0d79998ef55",
      key_description: "Frontend Key",
      key_type: "PUBLISHABLE",
      publishable_key: "pk_1234567890abcdef",
      is_origin_restricted: false,
      allowed_origins: [],
      subscription_id: "07f1f77bcf86cd799439014",
      expires_at: "2025-12-16T20:20:00.000Z",
    };

    const createSpy = jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockResolvedValue(createdKeyResult);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Frontend Key",
        expires_at: 30,
        key_type: "PUBLISHABLE",
        is_origin_restricted: false,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.publishable_key).toBe("pk_1234567890abcdef");
    expect(response.body.data.key_type).toBe("PUBLISHABLE");
    expect(response.body.data.is_origin_restricted).toBe(false);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        key_type: "PUBLISHABLE",
        is_origin_restricted: false,
        allowed_origins: [],
      }),
      mockuser
    );
  });

  it("200 - Publishable key generated (restricted with allowed origins)", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });

    const createdKeyResult = {
      _id: "6826d68a0fbea0d79998ef56",
      key_description: "Production App",
      key_type: "PUBLISHABLE",
      publishable_key: "pk_abcdef1234567890",
      is_origin_restricted: true,
      allowed_origins: ["https://example.com", "https://app.example.com"],
      subscription_id: "07f1f77bcf86cd799439014",
      expires_at: "2025-12-16T20:20:00.000Z",
    };

    const createSpy = jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockResolvedValue(createdKeyResult);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Production App",
        expires_at: 90,
        key_type: "PUBLISHABLE",
        is_origin_restricted: true,
        allowed_origins: ["https://example.com", "https://app.example.com"],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.is_origin_restricted).toBe(true);
    expect(response.body.data.allowed_origins).toEqual([
      "https://example.com",
      "https://app.example.com",
    ]);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        key_type: "PUBLISHABLE",
        is_origin_restricted: true,
        allowed_origins: ["https://example.com", "https://app.example.com"],
      }),
      mockuser
    );
  });

  it("422 - Fails when is_origin_restricted is true but allowed_origins is empty", async () => {
    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Restricted Key",
        expires_at: 30,
        key_type: "PUBLISHABLE",
        is_origin_restricted: true,
        allowed_origins: [],
      });

    expect(response.status).toBe(422);
    expect(response.body.message).toMatch(
      /At least one allowed origin is required/i
    );
  });

  it("422 - Fails when allowed_origins contains invalid URL", async () => {
    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Invalid URL Key",
        expires_at: 30,
        key_type: "PUBLISHABLE",
        is_origin_restricted: true,
        allowed_origins: ["not-a-valid-url"],
      });

    expect(response.status).toBe(422);
  });

  it("403 - Limit reached for PUBLISHABLE key", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["pk1", "pk2"],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 2, publishable_key_limit: 2 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { _id: "pk1", key_description: "PK One", key_type: "PUBLISHABLE" },
      { _id: "pk2", key_description: "PK Two", key_type: "PUBLISHABLE" },
    ]);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "PK Three",
        expires_at: 30,
        key_type: "PUBLISHABLE",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: Messages.LIMIT_REACHED,
      error: STATUS_CODES[403],
    });
  });

  it("200 - Allows creating PUBLISHABLE key when SECRET key limit is reached", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["sk1", "sk2"],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 2, publishable_key_limit: 2 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { _id: "sk1", key_description: "SK One", key_type: "SECRET" },
      { _id: "sk2", key_description: "SK Two", key_type: "SECRET" },
    ]);
    const createdKeyResult = {
      _id: "pk1",
      key_description: "New PK",
      key_type: "PUBLISHABLE",
      publishable_key: "pk_123456",
      is_origin_restricted: false,
      allowed_origins: [],
      subscription_id: "07f1f77bcf86cd799439014",
      expires_at: "2025-12-16T20:20:00.000Z",
    };
    jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockResolvedValue(createdKeyResult);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "New PK",
        expires_at: 30,
        key_type: "PUBLISHABLE",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.key_type).toBe("PUBLISHABLE");
  });

  it("200 - Allows creating SECRET key when PUBLISHABLE key limit is reached", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["pk1", "pk2"],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 2, publishable_key_limit: 2 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { _id: "pk1", key_description: "PK One", key_type: "PUBLISHABLE" },
      { _id: "pk2", key_description: "PK Two", key_type: "PUBLISHABLE" },
    ]);
    const createdKeyResult = {
      _id: "sk1",
      key_description: "New SK",
      key_type: "SECRET",
      subscription_id: "07f1f77bcf86cd799439014",
      expires_at: "2025-12-16T20:20:00.000Z",
    };
    jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockResolvedValue(createdKeyResult);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "New SK",
        expires_at: 30,
        key_type: "SECRET",
      });

    expect(response.status).toBe(200);
    expect(response.body.data.key_type).toBe("SECRET");
  });

  it("403 - Treats legacy keys without key_type as SECRET keys", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["legacy1", "legacy2"],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 2, publishable_key_limit: 2 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { _id: "legacy1", key_description: "Legacy One" }, // key_type undefined
      { _id: "legacy2", key_description: "Legacy Two" }, // key_type undefined
    ]);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Another SK",
        expires_at: 30,
        key_type: "SECRET",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(Messages.LIMIT_REACHED);
  });

  it("403 - Safely falls back to default publishable_key_limit = 2 when field is missing on subscription", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["pk1", "pk2"],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    // Subscription without publishable_key_limit property
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 5 });
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue([
      { _id: "pk1", key_description: "PK One", key_type: "PUBLISHABLE" },
      { _id: "pk2", key_description: "PK Two", key_type: "PUBLISHABLE" },
    ]);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "PK Three",
        expires_at: 30,
        key_type: "PUBLISHABLE",
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(Messages.LIMIT_REACHED);
  });
});

describe("Update User Key (PATCH /api/user/api-key/:keyId)", () => {
  const validKeyId = "6826d68a0fbea0d79998ef44";

  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("422 - Invalid keyId param", async () => {
    const response = await request(app)
      .patch("/api/user/api-key/invalid-id")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ key_description: "Updated Description" });

    expect(response.status).toBe(422);
  });

  it("404 - User not found", async () => {
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .patch(`/api/user/api-key/${validKeyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ key_description: "Updated Description" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(Messages.USER_NOT_FOUND);
  });

  it("404 - Key not owned by user", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: ["6826d68a0fbea0d79998ef99"], // different key
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);

    const response = await request(app)
      .patch(`/api/user/api-key/${validKeyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ key_description: "Updated Description" });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe(Messages.INVALID_KEY);
  });

  it("422 - Setting is_origin_restricted: true with empty allowed_origins fails", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [validKeyId],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest.spyOn(KeyService.prototype, "getKeyById").mockResolvedValue({
      _id: validKeyId,
      key_type: "PUBLISHABLE",
      is_origin_restricted: false,
      allowed_origins: [],
    });

    const response = await request(app)
      .patch(`/api/user/api-key/${validKeyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ is_origin_restricted: true, allowed_origins: [] });

    expect(response.status).toBe(422);
  });

  it("200 - Successfully updates publishable key origin restriction and allowed origins", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [validKeyId],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest.spyOn(KeyService.prototype, "getKeyById").mockResolvedValue({
      _id: validKeyId,
      key_type: "PUBLISHABLE",
      is_origin_restricted: false,
      allowed_origins: [],
    });

    const updatedKeyResult = {
      _id: validKeyId,
      key_description: "Updated Prod Key",
      key_type: "PUBLISHABLE",
      publishable_key: "pk_test123456",
      is_origin_restricted: true,
      allowed_origins: ["https://updated.example.com"],
      data: () => ({
        _id: validKeyId,
        key_description: "Updated Prod Key",
        key_type: "PUBLISHABLE",
        publishable_key: "pk_test123456",
        is_origin_restricted: true,
        allowed_origins: ["https://updated.example.com"],
      }),
    };

    jest
      .spyOn(UserService.prototype, "updateUserKey")
      .mockResolvedValue(updatedKeyResult);

    const response = await request(app)
      .patch(`/api/user/api-key/${validKeyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        key_description: "Updated Prod Key",
        is_origin_restricted: true,
        allowed_origins: ["https://updated.example.com"],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.key_description).toBe("Updated Prod Key");
    expect(response.body.data.is_origin_restricted).toBe(true);
    expect(response.body.data.allowed_origins).toEqual([
      "https://updated.example.com",
    ]);
  });

  it("200 - Regression: First PATCH request immediately returns newly updated publishable-key origin fields", async () => {
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [validKeyId],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    // Existing key before update has is_origin_restricted: false and allowed_origins: []
    jest.spyOn(KeyService.prototype, "getKeyById").mockResolvedValue({
      _id: validKeyId,
      key_type: "PUBLISHABLE",
      is_origin_restricted: false,
      allowed_origins: [],
    });

    const freshUpdatedKey = {
      _id: validKeyId,
      key_description: "My Frontend App",
      key_type: "PUBLISHABLE",
      publishable_key: "pk_fresh987654321",
      is_origin_restricted: true,
      allowed_origins: ["https://example.com"],
      data: () => ({
        _id: validKeyId,
        key_description: "My Frontend App",
        key_type: "PUBLISHABLE",
        publishable_key: "pk_fresh987654321",
        is_origin_restricted: true,
        allowed_origins: ["https://example.com"],
      }),
    };

    jest
      .spyOn(UserService.prototype, "updateUserKey")
      .mockResolvedValue(freshUpdatedKey);

    const firstPatchResponse = await request(app)
      .patch(`/api/user/api-key/${validKeyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({
        is_origin_restricted: true,
        allowed_origins: ["https://example.com"],
      });

    expect(firstPatchResponse.status).toBe(200);
    expect(firstPatchResponse.body.data.is_origin_restricted).toBe(true);
    expect(firstPatchResponse.body.data.allowed_origins).toEqual([
      "https://example.com",
    ]);
  });
});
