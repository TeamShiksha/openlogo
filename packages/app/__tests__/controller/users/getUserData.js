const request = require("supertest");
const { STATUS_CODES } = require("http");
const {
  UserService,
  SubscriptionService,
  KeyService,
} = require("../../../services");
const {
  MOCK_USERS,
  MOCK_SUBSCRIPTION,
  MOCK_KEYS,
} = require("../../../utils/mocks");
const { Keys, Subscriptions, Users } = require("../../../models");
const app = require("../../../server");

describe("GETUSERDATA", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "Your_JWT_SECRET";
    process.env.CLIENT_PROXY_URL = "http://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.CLIENT_PROXY_URL;
  });

  it("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .get("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: STATUS_CODES[404],
      message: "User not found",
    });
  });

  it("206 - User data not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(null);
    jest.spyOn(KeyService.prototype, "getAllUserKeys").mockResolvedValue(null);

    const response = await request(app)
      .get("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(206);
    expect(response.body).toEqual({
      statusCode: 206,
      error: STATUS_CODES[206],
      message: "User Data not found",
    });
  });

  it("200 - Success", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockSubscriptionModel = new Subscriptions(MOCK_SUBSCRIPTION[0]);
    const mockKeyModel = new Keys(MOCK_KEYS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue(mockSubscriptionModel);
    jest
      .spyOn(KeyService.prototype, "getAllUserKeys")
      .mockResolvedValue([mockKeyModel]);

    const response = await request(app)
      .get("/api/users/me")
      .set("Cookie", `jwt=${mockToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      email: mockUserModel.email,
      name: mockUserModel.name,
      userId: mockUserModel._id.toString(),
      role: mockUserModel.role,
      subscription_id: mockUserModel.subscription_id.toString(),
      is_deleted: mockUserModel.is_deleted,
      is_verified: mockUserModel.is_verified,
      created_at: mockUserModel._id.getTimestamp().toISOString(),
      updated_at: mockUserModel.updated_at.toISOString(),
      subscription: {
        _id: mockSubscriptionModel._id.toString(),
        is_active: mockSubscriptionModel.is_active,
        usage_limit: mockSubscriptionModel.usage_limit,
        key_limit: mockSubscriptionModel.key_limit,
        usage_count: mockSubscriptionModel.usage_count,
        type: mockSubscriptionModel.type,
        updated_at: mockSubscriptionModel.updated_at.toISOString(),
      },
      keys: [
        {
          _id: mockKeyModel._id.toString(),
          api_key: mockKeyModel.api_key,
          key_description: mockKeyModel.key_description,
          updated_at: mockKeyModel.updated_at.toISOString(),
        },
      ],
    });
  });
});
