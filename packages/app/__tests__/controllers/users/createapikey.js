const request = require("supertest");
const { STATUS_CODES } = require("http");
const { Users } = require("../../../models");
const {
  MOCK_USERS,
  MOCK_KEYS,
  MOCK_KEYS_VALIDITY_PERIOD,
} = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const {
  UserService,
  SubscriptionService,
  KeyService,
} = require("../../../services");
const app = require("../../../server");

describe("Generate User Key", () => {
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

  it("422 - Key Description must contain only alphabets and spaces", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      key_description: "Description@1234",
      expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
    };

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "Description must contain only alphabets and spaces",
      error: STATUS_CODES[422],
    });
  });

  it("404 - User not found", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockInput = {
      key_description: MOCK_KEYS[1].key_description,
      expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneMonth,
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `jwt=${mockToken}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("403 - Limit reached", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
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
      .mockResolvedValue({ key_limit: 2 });

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `jwt=${mockToken}`)
      .send({
        key_description: MOCK_KEYS[1].key_description,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      statusCode: 403,
      message: Messages.LIMIT_REACHED,
      error: STATUS_CODES[403],
    });
  });

  it("500 - Unexpected Error", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [
        { key_description: MOCK_KEYS[1].key_description },
        { key_description: MOCK_KEYS[2].key_description },
      ],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });
    jest
      .spyOn(KeyService.prototype, "getAllUserKeys")
      .mockResolvedValue([
        { key_description: MOCK_KEYS[1].key_description },
        { key_description: MOCK_KEYS[2].key_description },
      ]);
    jest
      .spyOn(UserService.prototype, "createNewUserKey")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `jwt=${mockToken}`)
      .send({
        key_description: MOCK_KEYS[1].key_description,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].threeMonths,
      });

    expect(response.status).toBe(500);
  });

  it("200 - Key generated ", async () => {
    const mockUserModel = new Users(MOCK_USERS[1]);
    const mockToken = mockUserModel.generateJWT();
    const mockuser = {
      ...MOCK_USERS[1],
      keys: [
        { key_description: MOCK_KEYS[1].key_description },
        { key_description: MOCK_KEYS[2].key_description },
      ],
    };
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockuser);
    jest
      .spyOn(SubscriptionService.prototype, "getSubscription")
      .mockResolvedValue({ key_limit: 3 });
    jest
      .spyOn(KeyService.prototype, "getAllUserKeys")
      .mockResolvedValue([
        { key_description: MOCK_KEYS[1].key_description },
        { key_description: MOCK_KEYS[2].key_description },
      ]);
    jest.spyOn(UserService.prototype, "createNewUserKey").mockResolvedValue({
      data: {
        key_description: MOCK_KEYS[1].key_description,
        subscription_id: "07f1f77bcf86cd799439014",
        expires_at: "2025-12-16T20:20:00.000Z",
      },
    });

    const response = await request(app)
      .post("/api/user/api-key")
      .set("Cookie", `jwt=${mockToken}`)
      .send({
        key_description: MOCK_KEYS[1].key_description,
        expires_at: MOCK_KEYS_VALIDITY_PERIOD[0].oneWeek,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: {
        data: {
          key_description: MOCK_KEYS[1].key_description,
          subscription_id: "07f1f77bcf86cd799439014",
          expires_at: "2025-12-16T20:20:00.000Z",
        },
      },
    });
  });
});
