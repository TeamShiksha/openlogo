const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { Messages } = require("../../../utils/constants");
const { UserService, SendEmailService } = require("../../../services");
const { MOCK_USERS } = require("../../../utils/mocks");
const app = require("../../../server");

describe("FORGOT PASSWORD API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("422 - Email is required", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email is required",
      statusCode: 422,
    });
  });

  it("422 - Invalid email", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "invalidEmail" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Email must be string", async () => {
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: 123 });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email must be string",
      statusCode: 422,
    });
  });

  it("404 - Email does not exist", async () => {
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.EMAIL_DOESNT_EXISTS,
      statusCode: 404,
    });
  });

  it("429 - Too many requests / Cooldown", async () => {
    const user = {
      ...MOCK_USERS[0],
      forgot_password_attempts: 2,
      forgot_password_last_reset_at: new Date(),
    };
    const error = new Error(Messages.TOO_MANY_REQUESTS);
    error.statusCode = 429;
    error.nextAllowedAt = new Date().toISOString();

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(SendEmailService.prototype, "sendForgotPasswordEmail")
      .mockResolvedValue(error);

    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      source: "sendEmail",
      error: STATUS_CODES[429],
      message: Messages.TOO_MANY_REQUESTS,
      statusCode: 429,
      nextAllowedAt: expect.any(String),
    });
  });

  it("200 - Successfully sent email", async () => {
    const user = {
      ...MOCK_USERS[0],
      forgot_password_attempts: 0,
      forgot_password_last_reset_at: new Date(),
    };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(SendEmailService.prototype, "sendForgotPasswordEmail")
      .mockResolvedValue({
        message: Messages.SENT_FORGOT_PASSWORD_EMAIL,
        statusCode: 200,
        nextAllowedAt: new Date().toISOString(),
      });
    const response = await request(app)
      .post(ENDPOINTS.FORGOT_PASSWORD)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      source: "sendEmail",
      statusCode: 200,
      message: Messages.SENT_FORGOT_PASSWORD_EMAIL,
    });
    expect(response.body.nextAllowedAt).toBeDefined();
  });
});
