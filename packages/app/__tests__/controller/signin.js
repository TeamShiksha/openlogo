const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../index");
const UserService = require("../../services/User");
const User = require("../../models/Users");
const mockUser = require("../../utils/mocks/Users");

const ENDPOINT = "/api/auth/signin";

describe("Signin Controller", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "jwtsecret";
  });

  afterAll(async () => {
    process.env.JWT_SECRET = "";
  });

  it("422 - Email must be a string", async () => {
    const response = await request(app).post(ENDPOINT).send({ email: 5 });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email must be a string",
      statusCode: 422,
    });
  });

  it("422 - Email is required", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .send({ user: "hello world" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Email is required",
      statusCode: 422,
    });
  });

  it("422 - Invalid email", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .send({ email: "not-an-email" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Password must be string", async () => {
    const response = await request(app)
      .post(ENDPOINT)
      .send({ email: "email@example.com", password: 5 });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must be string",
      statusCode: 422,
    });
  });

  it("422 - Password is required", async () => {
    const response = await request(app)
      .post(ENDPOINT)
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
      .post(ENDPOINT)
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
      .mockResolvedValue(new User(mockUser[0]));

    const response = await request(app)
      .post(ENDPOINT)
      .send({ email: "johndoe@example.com", password: "password123" });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      error: STATUS_CODES[403],
      message: "Email not verified",
      statusCode: 403,
    });
  });

  it("401 - Incorrect email or password", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new User(mockUser[1]));

    const response = await request(app)
      .post(ENDPOINT)
      .send({ email: "johndoe1@example.com", password: "password122" });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: STATUS_CODES[401],
      message: "Incorrect email or password",
      statusCode: 401,
    });
  });

  it("200 - Sign in successful", async () => {
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(new User(mockUser[1]));

    const response = await request(app)
      .post(ENDPOINT)
      .send({ email: "johndoe1@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
    });
    expect(response.headers["set-cookie"]).toBeDefined();
  });
});
