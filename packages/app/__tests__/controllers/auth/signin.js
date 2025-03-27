const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService, GuestUserService } = require("../../../services");
const { Users } = require("../../../models");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { MOCK_USERS, MOCK_GUESTTOKENS } = require("../../../utils/mocks");
const { Messages, GuestToken } = require("../../../utils/constants");
const app = require("../../../server");

describe("SIGNIN API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "jwtsecret";
    process.env.SALT_ROUNDS = 10;
  });

  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.SALT_ROUNDS;
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

  it("403 - Email not verified", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(MOCK_USERS[0]);
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "johndoe@example.com", password: "password123" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: "Email not verified",
      statusCode: 403,
    });
  });

  it("404 - Incorrect email or password", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockImplementation(() => new Users(MOCK_USERS[1]));
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "johndoe1@example.com", password: "password122" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INCORRECT_EMAIL_PASS,
      statusCode: 404,
    });
  });

  it("200 - Signin successful", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockImplementation(() => new Users(MOCK_USERS[1]));
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "johndoe1@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});

describe("GUEST SIGNIN API", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "randomSecret";
    process.env.SALT_ROUNDS = 10;
  });
  afterAll(() => {
    delete process.env.JWT_SECRET;
    delete process.env.SALT_ROUNDS;
  });

  it("200 - Successful Guest Sign In", async () => {
    jest
      .spyOn(GuestUserService.prototype, "handleGuestLogin")
      .mockResolvedValue(MOCK_GUESTTOKENS.validToken);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ isGuest: true });
    const cookies = response.headers["set-cookie"];

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ statusCode: 200 });

    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain(MOCK_GUESTTOKENS.validToken);
  });

  it("403 - Expired Token", async () => {
    jest
      .spyOn(GuestUserService.prototype, "handleGuestLogin")
      .mockResolvedValue(
        Object.assign(new Error(Messages.EXPIRED_TOKEN), {
          name: "TokenExpiredError",
          statusCode: 403,
        })
      );

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .set("Cookie", `${GuestToken}=${MOCK_GUESTTOKENS.expiredToken}`)
      .send({ isGuest: true });
    const cookies = response.headers["set-cookie"];

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: Messages.EXPIRED_TOKEN,
      statusCode: 403,
    });
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain("x-guest-token=;");
  });

  it("400 - Invalid Token", async () => {
    jest
      .spyOn(GuestUserService.prototype, "handleGuestLogin")
      .mockResolvedValue(Object.assign(new Error(Messages.INVALID_TOKEN)));

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .set("Cookie", `${GuestToken}=${MOCK_GUESTTOKENS.invalidToken}`)
      .send({ isGuest: true });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.INVALID_TOKEN,
      statusCode: 400,
    });
  });

  it("409 - Guest User already exists", async () => {
    jest
      .spyOn(GuestUserService.prototype, "handleGuestLogin")
      .mockResolvedValue(MOCK_USERS[4]);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .set("Cookie", `${GuestToken}=${MOCK_GUESTTOKENS.validToken}`)
      .send({ isGuest: true });
    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      error: STATUS_CODES[409],
      message: Messages.GUEST_USER_EXISTS,
      statusCode: 409,
    });
  });
});
