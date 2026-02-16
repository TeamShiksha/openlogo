const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Users } = require("../../../models");
const {
  UserService,
  UserSessionService,
  MfaService,
} = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const {
  MOCK_USERS,
  MOCK_SESSION_ID,
  MOCK_USER_SESSIONS,
} = require("../../../utils/mocks");

describe("MULTI FACTOR AUTH API", () => {
  it("200 - Enable MFA", async () => {
    const user = new Users(MOCK_USERS[1]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest
      .spyOn(MfaService.prototype, "enableMfa")
      .mockResolvedValue({ qrCode: "qrCode" });

    const response = await request(app)
      .post(ENDPOINTS.ENABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      data: { qrCode: "qrCode" },
    });
  });
  it("500 - Enable MFA failed", async () => {
    const user = new Users(MOCK_USERS[1]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest
      .spyOn(MfaService.prototype, "enableMfa")
      .mockResolvedValue({ qrCode: null });

    const response = await request(app)
      .post(ENDPOINTS.ENABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.MFA_FAILED,
      statusCode: 500,
    });
  });
  it("404 - User not found", async () => {
    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINTS.ENABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.USER_NOT_FOUND,
      statusCode: 404,
    });
  });
  it("400 - MFA token expired", async () => {
    const user = new Users(MOCK_USERS[1]);
    user.mfaTempSecretExpiresAt = new Date(Date.now() - 1000);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.VERIFY_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.EXPIRED_TOKEN,
      statusCode: 400,
    });
  });
  it("400 - MFA verification failed", async () => {
    const user = new Users(MOCK_USERS[1]);
    user.mfaTempSecretExpiresAt = new Date(Date.now() + 1000);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "verifyMfa").mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINTS.VERIFY_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.INVALID_TOKEN,
      statusCode: 400,
    });
  });
  it("500 - Failed to update user", async () => {
    const user = new Users(MOCK_USERS[1]);
    user.mfaTempSecretExpiresAt = new Date(Date.now() + 1000);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "verifyMfa").mockResolvedValue(true);
    jest.spyOn(MfaService.prototype, "updateMfaUser").mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINTS.VERIFY_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.MFA_FAILED,
      statusCode: 500,
    });
  });
  it("200 - Verify MFA", async () => {
    const user = new Users(MOCK_USERS[1]);
    user.mfaTempSecretExpiresAt = new Date(Date.now() + 1000);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "verifyMfa").mockResolvedValue(true);
    jest.spyOn(MfaService.prototype, "updateMfaUser").mockResolvedValue(true);

    const response = await request(app)
      .post(ENDPOINTS.VERIFY_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
  it("200 - Cancel MFA", async () => {
    const user = new Users(MOCK_USERS[1]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "disableMfa").mockResolvedValue(true);

    const response = await request(app)
      .post(ENDPOINTS.CANCEL_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
  it("500 - Failed to cancel MFA", async () => {
    const user = new Users(MOCK_USERS[1]);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "disableMfa").mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINTS.CANCEL_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.MFA_FAILED,
      statusCode: 500,
    });
  });
  it("200 - Disable MFA", async () => {
    const user = new Users(MOCK_USERS[1]);
    const newPassword = "dummyPassword";
    user.mfaEnabled = true;
    user.matchPassword = jest.fn().mockResolvedValue(true);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "disableMfa").mockResolvedValue(true);

    const response = await request(app)
      .post(ENDPOINTS.DISABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ password: newPassword });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
  });
  it("500 - Failed to disable MFA", async () => {
    const user = new Users(MOCK_USERS[1]);
    const newPassword = "dummyPassword";
    user.mfaEnabled = true;
    user.matchPassword = jest.fn().mockResolvedValue(true);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest.spyOn(MfaService.prototype, "disableMfa").mockResolvedValue(false);

    const response = await request(app)
      .post(ENDPOINTS.DISABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ password: newPassword });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.MFA_FAILED,
      statusCode: 500,
    });
  });
  it("404 - Incorrect password", async () => {
    const user = new Users(MOCK_USERS[1]);
    const newPassword = "dummyPassword";
    user.mfaEnabled = true;
    user.matchPassword = jest.fn().mockResolvedValue(false);

    jest
      .spyOn(UserSessionService.prototype, "validateSession")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.DISABLE_MFA)
      .set("Cookie", `sessionId=${MOCK_SESSION_ID}`)
      .send({ password: newPassword });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INCORRECT_EMAIL_PASS,
      statusCode: 404,
    });
  });
});
