const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const {
  UserService,
  UserTokenService,
  PasswordResetService,
} = require("../../../services");
const { Messages } = require("../../../utils/constants");

const app = require("../../../server");
const { MOCK_SESSION_ID, MOCK_USER_SESSIONS } = require("../../../utils/mocks");
const dummyPassword =
  require("../../../utils/generatePassword").generatePassword();

describe.skip("RESET PASSWORD API", () => {
  it("401 - User is not signed in", async () => {
    const response = await request(app).patch(ENDPOINTS.RESET_PASSWORD);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: STATUS_CODES[401],
      message: Messages.VERIFICATION_FAIL,
      statusCode: 401,
    });
  });

  it("422 - New password is required", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password is required",
      statusCode: 422,
    });
  });

  it("422 - New password must be 30 characters or fewer", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword.repeat(3),
        confirmPassword: "dummyPassword".repeat(3),
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must be 30 characters or fewer",
      statusCode: 422,
    });
  });

  it("422 - New password must be at least 8 characters", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({ newPassword: dummyPassword.slice(6) });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must be at least 8 characters",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one uppercase letter", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({ newPassword: dummyPassword.toLowerCase() });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one uppercase character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one lowercase letter", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({ newPassword: dummyPassword.toUpperCase() });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one lowercase character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one digit", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({ newPassword: dummyPassword.repeat(2).replace(/\d/g, "") });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one digit character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one special character", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword
          .repeat(2)
          .replace(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/g, ""),
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one special character",
      statusCode: 422,
    });
  });

  it("422 - Password and confirm password do not match", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword.slice(2),
        token: "validToken",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password and confirm password do not match",
      statusCode: 422,
    });
  });

  it("422 - Confirm password is required", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        token: "validToken",
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Confirm password is required",
      statusCode: 422,
    });
  });

  it("422 - Token must be a string", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
        token: 123,
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Token must be a string",
      statusCode: 422,
    });
  });

  it("422 - Token is required", async () => {
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
      });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Token is required",
      statusCode: 422,
    });
  });

  it("400 - Failed to update password", async () => {
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockResolvedValue(null);

    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
        token: "validToken",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.PASS_FAILED,
      statusCode: 400,
    });
  });

  it("403 - Invalid credentials", async () => {
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockResolvedValue({});
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue({ token: "invalidToken" });

    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
        token: "validToken",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: Messages.PASS_FAILED,
      statusCode: 403,
    });
  });

  it("200 - Success", async () => {
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);
    jest
      .spyOn(UserService.prototype, "updateUserPassword")
      .mockResolvedValue({});
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue({ token: "validToken" });
    jest
      .spyOn(UserTokenService.prototype, "deleteUserToken")
      .mockResolvedValue({});
    jest
      .spyOn(PasswordResetService.prototype, "findActiveSessionById")
      .mockResolvedValue(MOCK_USER_SESSIONS[0]);
    jest
      .spyOn(PasswordResetService.prototype, "deactivateSession")
      .mockResolvedValue({});

    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", [`resetPasswordSessionId=${MOCK_SESSION_ID}`])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
        token: "validToken",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ statusCode: 200 });
  });
});
