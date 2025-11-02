const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService, UserTokenService } = require("../../../services");
const { Users } = require("../../../models");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { MOCK_USERS, MOCK_USERTOKENS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const dummyPassword =
  require("../../../utils/generatePassword").generatePassword();
const sendEmail = require("../../../utils/sendEmail");
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

  it("201 - Email not verified / Send verification email", async () => {
    const user = {
      ...MOCK_USERS[0],
      is_verified: false,
      resend_email_count: 0,
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(UserService.prototype, "updateUserEmailCount")
      .mockResolvedValue(true);
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(MOCK_USERTOKENS[0]);
    jest
      .spyOn(UserTokenService.prototype, "updateUserToken")
      .mockResolvedValue({
        ...MOCK_USERTOKENS[0],
        tokenURL: () => "http://localhost/verify?token=mocktoken",
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

  it("429 - Email not verified / Too many requests", async () => {
    const user = {
      ...MOCK_USERS[0],
      is_verified: false,
      is_deleted: false,
      resend_email_count: 3,
      last_verification_email_sent_at: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(MOCK_USERTOKENS[0]);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: dummyPassword });

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      message: Messages.TRY_AFTER,
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
