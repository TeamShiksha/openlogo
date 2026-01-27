const request = require("supertest");
const { STATUS_CODES } = require("http");
const {
  MOCK_USERS,
  MOCK_USER_SESSIONS,
  MOCK_SESSION_ID,
} = require("../../../utils/mocks");
const { UserService, UserSessionService } = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("Update User Profile", () => {
  beforeAll(() => {
    process.env.CLIENT_PROXY_URL = "https://validcorsorigin.com";
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    delete process.env.CLIENT_PROXY_UR;
  });

  it("422 - First name should only contain alphabets", async () => {
    const mockInput = {
      name: "name@1234",
    };

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);

    const response = await request(app)
      .patch("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      statusCode: 422,
      message: "First name should only contain alphabets",
      error: STATUS_CODES[422],
    });
  });

  it("404 - User not found", async () => {
    const mockInput = {
      name: "Mockname",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .patch("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: Messages.USER_NOT_FOUND,
      error: STATUS_CODES[404],
    });
  });

  it("500 - Failed to update profile", async () => {
    const mockInput = {
      name: "Mockname",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest.spyOn(UserService.prototype, "updateUser").mockReturnValue(false);

    const response = await request(app)
      .patch("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      message: Messages.SOMETHING_WENT_WRONG,
      error: STATUS_CODES[500],
    });
  });

  it("500 - Unexpected Error", async () => {
    const mockInput = {
      name: "Mockname",
    };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest.spyOn(UserService.prototype, "updateUser").mockImplementation(() => {
      throw new Error();
    });

    const response = await request(app)
      .patch("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(500);
  });

  it("200 - User profile updated", async () => {
    const mockInput = {
      name: "Mockname",
    };
    const mockUpdatedResponse = { ...MOCK_USERS[1], name: mockInput.name };
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(UserService.prototype, "getUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserService.prototype, "updateUser")
      .mockResolvedValue(mockUpdatedResponse);

    const response = await request(app)
      .patch("/api/user/me")
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send(mockInput);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});
