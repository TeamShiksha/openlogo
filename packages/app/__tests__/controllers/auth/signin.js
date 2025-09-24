const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService } = require("../../../services");
const { Users } = require("../../../models");
const { ENDPOINTS } = require("../../../utils/testconstants");
const { MOCK_USERS } = require("../../../utils/mocks");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");

describe("SIGNIN API", () => {
  beforeAll(() => {
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
    jest
      .spyOn(UserService.prototype, "getAnyUserByEmail")
      .mockResolvedValue(null);

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
    const user = {
      ...MOCK_USERS[0],
      is_verified: false,
      matchPassword: jest.fn().mockResolvedValue(true),
      generateJWT: jest.fn().mockReturnValue("jwt-token"),
    };

    jest
      .spyOn(UserService.prototype, "getAnyUserByEmail")
      .mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: "password123" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: Messages.EMAIL_NOT_VERIFIED,
      statusCode: 403,
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

    jest
      .spyOn(UserService.prototype, "getAnyUserByEmail")
      .mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: "wrongpassword" });

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

    jest
      .spyOn(UserService.prototype, "getAnyUserByEmail")
      .mockResolvedValue(user);

    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: user.email, password: "password123" });

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
