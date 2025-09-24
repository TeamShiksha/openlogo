const request = require("supertest");
const { STATUS_CODES } = require("http");
// const { UserToken } = require("../../../models");
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
const sendEmail = require("../../../utils/sendEmail");
jest.mock("../../../utils/sendEmail");
const dummyPassword =
  require("../../../utils/generatePassword").generatePassword();

describe("SIGNUP API", () => {
  beforeAll(() => {
    process.env.CLIENT_URL = "https://localhost:3000";
    process.env.ADMINSEMAILS =
      "testAdminEmail1@gmail.com,testAdminEmail2@gmail.com,testAdminEmail3@gmail.com";
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
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

  it("422 - Password should contain at least one uppercase letter", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      password: dummyPassword.toLowerCase(),
      confirmPassword: dummyPassword.toLowerCase(),
    };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must contain at least one uppercase character",
      statusCode: 422,
    });
  });

  it("422 - Password should contain at least one lowercase letter", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      password: dummyPassword.toUpperCase(),
      confirmPassword: dummyPassword.toUpperCase(),
    };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must contain at least one lowercase character",
      statusCode: 422,
    });
  });

  it("422 - Password should contain at least one digit", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      password: dummyPassword.repeat(2).replace(/\d/g, ""),
      confirmPassword: dummyPassword.repeat(2).replace(/\d/g, ""),
    };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must contain at least one digit character",
      statusCode: 422,
    });
  });

  it("422 - Password should contain at least one special character", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      password: dummyPassword
        .repeat(2)
        .replace(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/g, ""),
      confirmPassword: dummyPassword
        .repeat(2)
        .replace(/[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/g, ""),
    };
    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: "Password must contain at least one special character",
      statusCode: 422,
    });
  });

  it("422 - ConfirmPassword and Password should match", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      confirmPassword: dummyPassword,
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
      .spyOn(UserService.prototype, "canRegister")
      .mockRejectedValue(new Error(Messages.EMAIL_EXISTS));

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
    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
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
    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
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
    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
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
    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue({ _id: "mockSubId" });
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[1]);
    const mockToken = {
      ...MOCK_USERTOKENS[0],
      tokenURL: jest.fn().mockReturnValue("http://example.com/verify-token"),
    };
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(mockToken);

    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
    expect(sendEmail).toHaveBeenCalledWith({
      id: 2,
      subject: "Openlogo: Email Verification",
      recipient: mockRequest.email,
      body: {
        url: "http://example.com/verify-token",
      },
    });
  });

  it("200 - Admin created successfully", async () => {
    const mockRequest = {
      ...SIGNUP_PAYLOAD,
      email: process.env.ADMINSEMAILS.split(",")[0],
    };
    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue({ _id: "mockSubId" });
    jest.spyOn(UserService.prototype, "getRole").mockReturnValue("ADMIN");
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[2]);
    const mockToken = {
      ...MOCK_USERTOKENS[0],
      tokenURL: jest.fn().mockReturnValue("http://example.com/verify-token"),
    };
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(mockToken);

    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });

  it("400 - Deleted user within block period cannot signup", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD, email: "deleted@example.com" };

    const blockMessage = "Account exists. You may re-register after 5 days.";
    jest
      .spyOn(UserService.prototype, "canRegister")
      .mockRejectedValue(new Error(blockMessage));

    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(STATUS_CODES[400]);
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe(blockMessage);
  });

  it("200 - Deleted user block expired can signup", async () => {
    const mockRequest = { ...SIGNUP_PAYLOAD, email: "deleted@example.com" };

    jest.spyOn(UserService.prototype, "canRegister").mockResolvedValue(true);
    jest
      .spyOn(SubscriptionService.prototype, "createSubscription")
      .mockResolvedValue({ _id: "mockSubId" });
    jest
      .spyOn(UserService.prototype, "createUser")
      .mockResolvedValue(MOCK_USERS[1]);

    const mockToken = {
      ...MOCK_USERTOKENS[0],
      tokenURL: jest.fn().mockReturnValue("http://example.com/verify-token"),
    };
    jest
      .spyOn(UserTokenService.prototype, "createUserToken")
      .mockResolvedValue(mockToken);

    const response = await request(app)
      .post(ENDPOINTS.SIGNUP)
      .send(mockRequest);

    expect(response.status).toBe(200);
    expect(response.body.statusCode).toBe(200);
  });
});
