const request = require("supertest");
const {
  UserService,
  KeyService,
  UserSessionService,
} = require("../../../services");
const app = require("../../../server");
const {
  MOCK_USERS,
  MOCK_KEYS,
  MOCK_USER_SESSIONS,
  MOCK_SESSION_ID,
} = require("../../../utils/mocks");

describe("Update User Old Keys", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("404 - User not found", async () => {
    const mockInput = {
      key_description: MOCK_KEYS[2].key_description,
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .get("/api/user/update-old-keys")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      error: "Not Found",
      message: "User not found.",
    });
  });

  it("200 - should return true when keys are successfully updated", async () => {
    const mockUser = {
      ...MOCK_USERS[1],
      keys: MOCK_KEYS[3]._id,
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    jest
      .spyOn(KeyService.prototype, "findUpdateKeyWithoutExpiry")
      .mockResolvedValue(true);

    const response = await request(app)
      .get("/api/user/update-old-keys")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockUser.keys);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      keysUpdated: true,
    });
  });

  it("200 - should return false when no keys need updating", async () => {
    const mockUser = {
      ...MOCK_USERS[1],
      keys: MOCK_KEYS[2]._id,
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(mockUser);

    jest
      .spyOn(KeyService.prototype, "findUpdateKeyWithoutExpiry")
      .mockResolvedValue(false);

    const response = await request(app)
      .get("/api/user/update-old-keys")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockUser.keys);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      keysUpdated: false,
    });
  });
});
