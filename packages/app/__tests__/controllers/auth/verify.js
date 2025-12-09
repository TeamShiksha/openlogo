const request = require("supertest");
const { STATUS_CODES } = require("http");
const { ENDPOINTS } = require("../../../utils/testconstants");
const {
  UserService,
  UserTokenService,
  SendEmailService,
} = require("../../../services");
const { Messages } = require("../../../utils/constants");
const app = require("../../../server");
const { MOCK_USERS } = require("../../../utils/mocks");
const sendEmail = require("../../../utils/sendEmail");
const dayjs = require("dayjs");

jest.mock("../../../utils/sendEmail");

describe("VERIFY EMAIL API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
  });

  it("422 - No token provided", async () => {
    const response = await request(app).get(ENDPOINTS.VERIFY).send();

    expect(response.status).toBe(422);
    expect(response.body).toEqual({
      error: STATUS_CODES[422],
      message: Messages.INVALID_TOKEN,
      statusCode: 422,
    });
  });

  it("404 - Invalid token", async () => {
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(null);
    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/invalidToken`)
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: STATUS_CODES[400],
      message: Messages.INVALID_TOKEN,
      statusCode: 400,
    });
  }, 10000);

  it("429 - when sendVerificationEmail fails", async () => {
    const user = {
      ...MOCK_USERS[0],
      _id: MOCK_USERS[0]._id,
      is_verified: false,
      last_verification_email_sent_at: dayjs().subtract(1, "hour").toDate(),
    };
    const mockToken = {
      user_id: user._id,
      token: "expiredToken",
      isExpired: jest.fn().mockReturnValue(true),
    };
    const error = new Error(Messages.EMAIL_NOT_VERIFIED);
    error.statusCode = 429;

    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(user);
    jest
      .spyOn(SendEmailService.prototype, "sendVerificationEmail")
      .mockResolvedValue(error);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/expiredToken`)
      .send();

    expect(response.status).toBe(429);
    expect(response.body).toEqual({
      source: "resendEmail",
      error: "Too Many Requests",
      message: Messages.EMAIL_NOT_VERIFIED,
      statusCode: 429,
    });
  });

  it("201 - Token is expired and successfully sends a verification email", async () => {
    const user = {
      ...MOCK_USERS[0],
      _id: MOCK_USERS[0]._id,
      is_verified: false,
      resend_email_count: 0,
      last_verification_email_sent_at: dayjs().subtract(25, "hour").toDate(),
    };
    const mockToken = {
      user_id: user._id,
      token: "expiredToken",
      isExpired: jest.fn().mockReturnValue(true),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUserByEmail").mockResolvedValue(user);
    jest
      .spyOn(SendEmailService.prototype, "sendVerificationEmail")
      .mockResolvedValue({
        message: Messages.RESEND_EMAIL,
        statusCode: 201,
        source: "resendEmail",
      });

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/expiredToken`)
      .send();

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: Messages.RESEND_EMAIL,
      statusCode: 201,
      source: "resendEmail",
    });
  });
  it("404 - Invalid Token", async () => {
    const mockToken = {
      user_id: "invalid-user-id",
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue(null);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/invalidToken`)
      .send();

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: STATUS_CODES[404],
      message: Messages.INVALID_TOKEN,
      statusCode: 404,
    });
    expect(mockToken.isExpired).not.toHaveBeenCalled();
  });

  it("500 - Verification failed", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(false);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.VERIFICATION_FAIL,
      statusCode: 500,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });

  it("500 - Something went wrong", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(true);
    jest
      .spyOn(UserTokenService.prototype, "deleteUserToken")
      .mockResolvedValue(null);

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: STATUS_CODES[500],
      message: Messages.SOMETHING_WENT_WRONG,
      statusCode: 500,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });

  it("200 - Verified", async () => {
    const mockToken = {
      isExpired: jest.fn().mockReturnValue(false),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserToken")
      .mockResolvedValue(mockToken);
    jest.spyOn(UserService.prototype, "getUser").mockResolvedValue({});
    jest.spyOn(UserService.prototype, "verifyUser").mockResolvedValue(true);
    jest
      .spyOn(UserTokenService.prototype, "deleteUserToken")
      .mockResolvedValue({});

    const response = await request(app)
      .get(`${ENDPOINTS.VERIFY}/validToken`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      statusCode: 200,
      message: "Email verified successfully",
      success: true,
    });
    expect(mockToken.isExpired).toHaveBeenCalled();
  });
});
