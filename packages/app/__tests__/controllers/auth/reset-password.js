const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { UserService, UserTokenService } = require("../../../services");
const jwt = require("jsonwebtoken");
const { Messages } = require("../../../utils/constants");
const mongoose = require("mongoose");

const app = require("../../../server");
const dummyPassword =
  require("../../../utils/generatePassword").generatePassword();
jest.mock("jsonwebtoken");
jwt.verify = jest.fn(() => ({ userId: new mongoose.Types.ObjectId() }));

describe("RESET PASSWORD API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "secret";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

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
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password is required",
      statusCode: 422,
    });
  });

  it("422 - New password must be 30 characters or fewer", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({ newPassword: dummyPassword.repeat(3) });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must be 30 characters or fewer",
      statusCode: 422,
    });
  });

  it("422 - New password must be at least 8 characters", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({ newPassword: dummyPassword.slice(6) });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must be at least 8 characters",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one uppercase letter", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({ newPassword: dummyPassword.toLowerCase() });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one uppercase character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one lowercase letter", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({ newPassword: dummyPassword.toUpperCase() });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one lowercase character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one digit", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({ newPassword: dummyPassword.repeat(2).replace(/\d/g, "") });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "New password must contain at least one digit character",
      statusCode: 422,
    });
  });

  it("422 - New password must contain at least one special character", async () => {
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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
    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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

    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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

    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
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

    const response = await request(app)
      .patch(ENDPOINTS.RESET_PASSWORD)
      .set("Cookie", ["resetPasswordSession=mockToken"])
      .send({
        newPassword: dummyPassword,
        confirmPassword: dummyPassword,
        token: "validToken",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ statusCode: 200 });
  });
});
