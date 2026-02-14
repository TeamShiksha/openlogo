const request = require("supertest");
const { STATUS_CODES } = require("http");
const {
  MOCK_USERS,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
} = require("../../../utils/mocks");
const { mongoose } = require("mongoose");
const { UserService, UserSessionService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("Destroy User Key", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_URL;
  });

  it("404 - Invalid Key", async () => {
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "destroyUserKey")
      .mockResolvedValue(false);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: Messages.INVALID_KEY,
      statusCode: STATUS_CODES[404],
    });
  });

  it("404 - User not found", async () => {
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("500 - Unexpected Error", async () => {
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "destroyUserKey")
      .mockImplementation(() => {
        throw new Error();
      });

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(500);
  });

  it("200 - Key Destroyed", async () => {
    const keyId = new mongoose.Types.ObjectId().toString();

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest.spyOn(UserService.prototype, "destroyUserKey").mockResolvedValue(true);

    const response = await request(app)
      .delete(`/api/user/api-key/${keyId}`)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
});
