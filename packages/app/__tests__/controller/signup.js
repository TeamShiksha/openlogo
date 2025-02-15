const request = require("supertest");
const { STATUS_CODES } = require("http");
const app = require("../../index");

const UserService = require("../../services/User");
const SubscriptionService = require("../../services/Subscription");
const UserTokenService = require("../../services/UserToken");
const { signupRequest, Endpoints } = require("../../utils/testconstants");
const { Users, UserToken, Subscriptions } = require("../../models");
const mockUser = require("../../utils/mocks/Users");
const mockUserTokens = require("../../utils/mocks/UserToken");
const mockSubscriptions = require("../../utils/mocks/Subscription");

const mockUserModel = new Users(mockUser[1]);
const mockUserTokenVerify = new UserToken(mockUserTokens[0]);
const mockSubscriptionModel = new Subscriptions(mockSubscriptions[0]);

describe("Signup Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("422 - should be a valid email", async () => {
    const mockRequest = { ...signupRequest, email: "hdgftsjcne" };

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  test("422 - Should not be an empty email", async () => {
    const mockRequest = { ...signupRequest, email: "" };

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "\"email\" is not allowed to be empty",
      statusCode: 422,
    });
  });

  test("422 - Name should not be empty", async () => {
    const mockRequest = { ...signupRequest, name: "" };

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "\"name\" is not allowed to be empty",
      statusCode: 422,
    });
  });

  test("422 - ConfirmPassword and Password should be same", async () => {
    const mockRequest = {
      ...signupRequest,
      password: "testname@1234",
      confirmPassword: "testname@5678",
    };

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password and confirm password do not match",
      statusCode: 422,
    });
  });

  test("400 - Email should not be already registered", async () => {
    const mockRequest = { ...signupRequest, email: "testname@gmail.com" };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(mockUser[0]);

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: "Email already exists",
      statusCode: 400,
    });
  });

  test("500 - Should create a new Subscription", async () => {
    const mockRequest = { ...signupRequest };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(null);

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: "Something went wrong. Please Try again later!",
      statusCode: 500,
    });
  });

  test("500 - should be able to create a new User", async () => {
    const mockRequest = { ...signupRequest };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(mockSubscriptionModel);
    jest.spyOn(UserService.prototype, "createUser").mockResolvedValue(null);

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: "Something went wrong. Try again later!",
      statusCode: 500,
    });
  });

  test("201 - Should be able to create a new verification Token", async () => {
    const mockRequest = { ...signupRequest };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(mockSubscriptionModel);
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(null);

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message:
        "Registration Successful. Email failed to send. Contact us for assistance.",
      statusCode: 201,
    });
  });

  test("200 - User created successfully", async () => {
    const mockRequest = { ...signupRequest };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(true);
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(mockUserModel);
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(mockUserTokenVerify);

    const response = await request(app)
      .post(Endpoints.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});
