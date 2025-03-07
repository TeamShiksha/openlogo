const request = require("supertest");
const { STATUS_CODES } = require("http");
const { UserToken } = require("../../../models");
const {
  UserTokenService,
  UserService,
  SubscriptionService,
} = require("../../../services");
const { SIGNUP_PAYLOAD, ENDPOINTS } = require("../../../utils/testconstants");
const { Messages } = require("../../../utils/constants");
const {
  MOCK_USERS,
  MOCK_SUBSCRIPTION,
  MOCK_USERTOKENS,
} = require("../../../utils/mocks");
const app = require("../../../server");

describe("SIGNUP API", () => {
  beforeAll(() => {
    process.env.CLIENT_URL = "https://localhost:3000";
    process.env.ADMINSEMAILS =
      "testAdminEmail1@gmail.com,testAdminEmail2@gmail.com,testAdminEmail3@gmail.com";
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.CLIENT_URL;
    delete process.env.ADMINSEMAILS;
  });

  it("422 - Payload should be a valid email", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD, email: "hdgftsjcne" };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Invalid email",
      statusCode: 422,
    });
  });

  it("422 - Name should not be empty", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD, name: "" };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: '"name" is not allowed to be empty',
      statusCode: 422,
    });
  });

  it("422 - ConfirmPassword and Password should match", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      confirmPassword: "testname@5678",
    };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password and confirm password do not match",
      statusCode: 422,
    });
  });

  it("400 - Email already registered", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD, email: "testname@gmail.com" };
    jest
      .spyOn(UserService.prototype, "getUserByEmail")
      .mockResolvedValue(MOCK_USERS[0]);
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.EMAIL_EXISTS,
      statusCode: 400,
    });
  });

  it("500 - Failed creating subscription", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
    });
  });

  it("500 - Failed creating user", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[0]);
    jest.spyOn(UserService.prototype, "createUser").mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
    });
  });

  it("201 - Failed creating verificiation token", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(MOCK_SUBSCRIPTION[0]);
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(null);
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 201,
    });
  });

  it("200 - User created successfully", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(true);
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[1]);
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockImplementation(() => new UserToken(MOCK_USERTOKENS[0]));
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });

  it("200 - Admin created successfully", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      email: process.env.ADMINSEMAILS.split(",")[0],
    };
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(null);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue(true);
    jest.spyOn(UserService.prototype, "getRole").mockReturnValue("ADMIN");
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[2]);
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockImplementation(() => new UserToken(MOCK_USERTOKENS[0]));
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});
