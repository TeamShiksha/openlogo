const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService, UserTokenService } = require("../../../services");
const { Users } = require("../../../models");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const dummyPassword =
  require("../../../utils/generatePassword").generatePassword();
const sendEmail = require("../../../utils/sendEmail");
const dayjs = require("dayjs");
jest.mock("../../../utils/sendEmail");

describe("SIGNIN API", () => {
  beforeAll(() => {
    sendEmail.mockResolvedValue(true);
    process.env.JWT_SECRET = "jwtsecret";
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
  });

  it("422 - Invalid email", async () => {
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "not-an-email" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Password is required", async () => {
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "email@example.com" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password is required",
      statusCode: 422,
    });
  });

  it("404 - Incorrect email or password", async () => {
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "email@example.com", password: "password" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INCORRECT_EMAIL_PASS,
      statusCode: 404,
    });
  });

  it("201 - Email is not verified and sending verification email succeeds", async () => {
    const user = {
      ...MOCK_USERS[0],
      is_verified: false,
      resend_email_count: 0,
      last_verification_email_sent_at: dayjs().subtract(25, "hour").toDate(),
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(UserTokenService.prototype, "resendVerificationEmail")
      .mockResolvedValue({
        success: true,
        message: Messages.RESEND_EMAIL,
      });

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: dummyPassword });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: Messages.RESEND_EMAIL,
      statusCode: 201,
      source: "resendEmail",
    });
  });

  it("429 - Email is not verified and sending verification email fails due to rate limiting", async () => {
    const user = {
      ...MOCK_USERS[0],
      is_verified: false,
      is_deleted: false,
      resend_email_count: 3,
      last_verification_email_sent_at: dayjs().subtract(1, "hour").toDate(),
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    const rateLimitError = new Error(Messages.TRY_AGAIN);
    rateLimitError.statusCode = 429;

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(UserTokenService.prototype, "resendVerificationEmail")
      .mockRejectedValue(rateLimitError);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: dummyPassword });

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: Messages.TRY_AGAIN,
      statusCode: 429,
      source: "resendEmail",
    });
  });

  it("404 - Incorrect password", async () => {
    const user = {
      ...MOCK_USERS[1],
      is_verified: true,
      is_deleted: false,
      matchPassword: jest.fn().mockResolvedValue(false),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);

    const INVAILD = "wrongpassword";
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: INVAILD });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INCORRECT_EMAIL_PASS,
      statusCode: 404,
    });
  });

  it("200 - Signin successful", async () => {
    const user = {
      ...MOCK_USERS[1],
      is_verified: true,
      is_deleted: false,
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: dummyPassword });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ statusCode: 200 });
    expect(response.headers["set-cookie"]).toBeDefined();
  });

  it("200 - Guest Signin successful", async () => {
    jest
      .spyOn(UserService.prototype, "getGuestUser")
      .mockImplementation(() => new Users(MOCK_USERS[4]));
    const response = await request(app)
      .post(`${ENDPOINTS.SIGNIN}?type=guest`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
