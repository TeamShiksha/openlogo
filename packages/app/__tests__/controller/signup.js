const request = require("supertest");
const app = require("../../index");
const UserService = require("../../services/User");
const SubscriptionService = require("../../services/Subscription");
const UserTokenService = require("../../services/UserToken");
const InitialRequest = require("../../utils/testConstants/constants");
const ENDPOINT = "/api/auth/signup";

jest.mock("../../services/User");
jest.mock("../../services/Subscription");
jest.mock("../../services/UserToken");

describe("Signup Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should be a valid email", async () => {
    const mockRequest = { ...InitialRequest, email: "hdgftsjcne" };

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe("Invalid email");
    expect(response.body.statusCode).toBe(422);
  });

  test("Should not be an empty email", async () => {
    const mockRequest = { ...InitialRequest, email: "" };

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('"email" is not allowed to be empty');
    expect(response.statusCode).toBe(422);
  });

  test("Name should not be empty", async () => {
    const mockRequest = { ...InitialRequest, name: "" };
    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe('"name" is not allowed to be empty');
    expect(response.body.statusCode).toBe(422);
  });

  test("ConfirmPassword and Password should be same", async () => {
    const mockRequest = {
      ...InitialRequest,
      password: "testname@1234",
      confirmPassword: "testname@5678",
    };
    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body.message).toBe(
      "Password and confirm password do not match",
    );
    expect(response.body.statusCode).toBe(422);
  });

  test("Email should not be already registered", async () => {
    const mockRequest = { ...InitialRequest, email: "testname@gmail.com" };

    UserService.prototype.getUserByEmail.mockResolvedValue({
      _id: "id@123",
      email: "testname@gmail.com",
      name: "TESTONE",
      password: "hashedPassword",
      subscription_id: "sub@123",
    });

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Email already exists");
    expect(response.body.statusCode).toBe(400);
  });

  test("Should create a new Subscription", async () => {
    const mockRequest = { ...InitialRequest };
    UserService.prototype.getUserByEmail.mockResolvedValue(null);
    SubscriptionService.prototype.createSubscription.mockResolvedValue(null);

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Something went wrong. Please Try again later!",
    );
    expect(response.body.statusCode).toBe(500);
  });

  test("should be able to create a new User", async () => {
    const mockRequest = { ...InitialRequest };

    UserService.prototype.getUserByEmail.mockResolvedValue(null);
    SubscriptionService.prototype.createSubscription.mockResolvedValue({
      _id: "sub@123",
    });

    UserService.prototype.createUser.mockResolvedValue(null);

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body.message).toBe(
      "Something went wrong. Try again later!",
    );
    expect(response.body.statusCode).toBe(500);
  });

  test("Should be able to create a new verification token", async () => {
    const mockReuest = { ...InitialRequest };
    UserService.prototype.getUserByEmail.mockResolvedValue(null);
    SubscriptionService.prototype.createSubscription.mockResolvedValue({
      _id: "sub123",
    });

    UserService.prototype.createUser.mockResolvedValue({
      email: "testname@gmail.com",
      name: "TESTNAME",
      password: "testname@1234",
      confirmPassword: "testname@1234",
      subscription_id: "sub@123",
    });

    UserTokenService.prototype.createUserToken.mockResolvedValue(null);

    const response = await request(app).post(ENDPOINT).send(mockReuest);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe(
      "Registration Successful. Email failed to send. Contact us for assistance.",
    );
    expect(response.body.statusCode).toBe(201);
  });

  test("Should be able to create a user end to end", async () => {
    const mockRequest = { ...InitialRequest };

    UserService.prototype.getUserByEmail.mockResolvedValue(null);
    SubscriptionService.prototype.createSubscription.mockResolvedValue({
      _id: "sub@123",
    });

    UserService.prototype.createUser.mockResolvedValue({
      email: "testname@gmail.com",
      name: "TESTNAME",
      password: "testname@1234",
      confirmPassword: "testname@1234",
      subscription_id: "sub@123",
    });

    UserTokenService.prototype.createUserToken.mockResolvedValue({
      token: "token@123",
      user_id: "userID@1234",
      _id: "id@1234",
    });

    const response = await request(app).post(ENDPOINT).send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});
