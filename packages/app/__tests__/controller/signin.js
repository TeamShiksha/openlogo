const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserService } = require("../../services");
const { Users } = require("../../models");
const { ENDPOINTS } = require("../../utils/testconstants");
const { MOCK_USERS } = require("../../utils/mocks");
const app = require("../../index");

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
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.SIGNIN)
      .send({ email: "email@example.com", password: "password" });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: "Incorrect email or password",
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
      message: "Incorrect email or password",
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
