const SendEmailService = require("../../services/sendemail");
const UserService = require("../../services/users");
const UserTokenService = require("../../services/usertoken");
const User = require("../../models/users");
const UserToken = require("../../models/usertoken");
const { MOCK_USERS, MOCK_USERTOKENS } = require("../../utils/mocks");
const sendEmail = require("../../utils/sendEmail");
const { Messages } = require("../../utils/constants");
const dayjs = require("dayjs");

jest.mock("../../utils/sendEmail");

describe("Send Email Service", () => {
  let sendEmailService;

  beforeEach(() => {
    sendEmailService = new SendEmailService();
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
  });

  it("Should fail to send verification email if user token is not found", async () => {
    const user = new User(MOCK_USERS[0]);
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);

    const result = await sendEmailService.sendVerificationEmail(user);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.INVALID_TOKEN);
    expect(result.statusCode).toBe(404);
  });

  it("Should fail to send verification email if user token is not expired", async () => {
    const user = new User(MOCK_USERS[0]);
    const mockToken = new UserToken({
      ...MOCK_USERTOKENS[0],
    });
    mockToken.isExpired = jest.fn().mockReturnValue(false);
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(mockToken);

    const result = await sendEmailService.sendVerificationEmail(user);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.EMAIL_NOT_VERIFIED);
    expect(result.statusCode).toBe(429);
  });

  it("Should fail to send verification email if failed to update token", async () => {
    const user = new User(MOCK_USERS[0]);
    const mockToken = new UserToken({
      ...MOCK_USERTOKENS[0],
    });
    mockToken.isExpired = jest.fn().mockReturnValue(true);
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(mockToken);
    jest
      .spyOn(UserTokenService.prototype, "updateUserToken")
      .mockResolvedValue(null);

    const result = await sendEmailService.sendVerificationEmail(user);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.FAILED_UPDATE_TOKEN);
    expect(result.statusCode).toBe(400);
  });

  it("Should send verification email if all checks pass", async () => {
    const user = new User(MOCK_USERS[0]);
    const mockToken = new UserToken({
      ...MOCK_USERTOKENS[0],
      type: "VERIFY",
      token: "abc123",
    });
    mockToken.isExpired = jest.fn().mockReturnValue(true);
    mockToken.tokenURL = jest
      .fn()
      .mockReturnValue(`https://client.com/verify?token=abc123`);
    const updatedToken = {
      ...mockToken,
      expire_at: new Date(),
      tokenURL: jest
        .fn()
        .mockReturnValue(`https://client.com/verify?token=abc123`),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(mockToken);
    jest
      .spyOn(UserTokenService.prototype, "updateUserToken")
      .mockResolvedValue(updatedToken);

    const result = await sendEmailService.sendVerificationEmail(user);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith({
      id: 2,
      subject: "Openlogo: Email Verification",
      recipient: user.email,
      body: {
        url: `https://client.com/verify?token=abc123`,
      },
    });
    expect(result).toEqual({
      success: true,
      message: Messages.RESEND_EMAIL,
    });
  });

  it("Should set forgot password attempts to 0 if last reset was more than 24 hours ago", async () => {
    const user = new User(MOCK_USERS[0]);
    user.forgot_password_last_reset_at = dayjs().subtract(25, "hour").toDate();
    user.forgot_password_attempts = 1;
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue({
        token: "dummy",
        tokenURL: () => "dummy-url",
      });
    const updateSpy = jest
      .spyOn(UserService.prototype, "updateUserFortgotPasswordAttempts")
      .mockResolvedValue(user);

    await sendEmailService.sendForgotPasswordEmail(user);

    expect(updateSpy).toHaveBeenCalledWith(user, true);
  });

  it("Should block forgot password email if cooldown period has not passed", async () => {
    const user = new User(MOCK_USERS[0]);
    user.forgot_password_last_reset_at = dayjs().subtract(1, "second").toDate();
    user.forgot_password_attempts = 1;
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue({
        token: "dummy",
        tokenURL: () => "dummy-url",
      });
    jest
      .spyOn(UserService.prototype, "updateUserFortgotPasswordAttempts")
      .mockResolvedValue(null);

    const result = await sendEmailService.sendForgotPasswordEmail(user);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.TOO_MANY_REQUESTS);
    expect(result.statusCode).toBe(429);
    expect(result.nextAllowedAt).toBeDefined();
  });

  it("Should block forgot password email if max attempts reached", async () => {
    const user = new User(MOCK_USERS[0]);
    user.forgot_password_last_reset_at = dayjs().subtract(1, "hour").toDate();
    user.forgot_password_attempts = 2;
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue({
        token: "dummy",
        tokenURL: () => "dummy-url",
      });
    jest
      .spyOn(UserService.prototype, "updateUserFortgotPasswordAttempts")
      .mockResolvedValue(null);

    const result = await sendEmailService.sendForgotPasswordEmail(user);

    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.TRY_AGAIN);
    expect(result.statusCode).toBe(429);
  });

  it("Should create new forgot password token if none exists", async () => {
    const user = new User(MOCK_USERS[0]);
    user.forgot_password_last_reset_at = dayjs().subtract(1, "hour").toDate();
    user.forgot_password_attempts = 1;
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);
    jest
      .spyOn(UserTokenService.prototype, "createForgotToken")
      .mockResolvedValue({
        token: "dummy",
        tokenURL: () => "dummy-url",
      });
    jest
      .spyOn(UserService.prototype, "updateUserFortgotPasswordAttempts")
      .mockResolvedValue(user);

    const result = await sendEmailService.sendForgotPasswordEmail(user);

    expect(UserTokenService.prototype.createForgotToken).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith({
      id: 1,
      subject: "Reset Your Password",
      recipient: user.email,
      body: {
        url: "dummy-url",
      },
    });
    expect(result).toMatchObject({
      message: Messages.SENT_FORGOT_PASSWORD_EMAIL,
      statusCode: 200,
    });
    expect(result.nextAllowedAt).toBeDefined();
  });

  it("Should update forgot password token if existing token is found", async () => {
    const user = new User(MOCK_USERS[0]);
    user.forgot_password_last_reset_at = dayjs().subtract(1, "hour").toDate();
    user.forgot_password_attempts = 1;
    const mockToken = new UserToken({
      ...MOCK_USERTOKENS[0],
      type: "FORGOT",
      token: "abc123",
    });
    const updatedToken = {
      ...mockToken,
      expire_at: new Date(),
      tokenURL: jest.fn().mockReturnValue("dummy-url"),
    };
    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(mockToken);
    jest
      .spyOn(UserTokenService.prototype, "updateUserToken")
      .mockResolvedValue(updatedToken);
    jest
      .spyOn(UserService.prototype, "updateUserFortgotPasswordAttempts")
      .mockResolvedValue(user);

    const result = await sendEmailService.sendForgotPasswordEmail(user);

    expect(UserTokenService.prototype.updateUserToken).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(sendEmail).toHaveBeenCalledWith({
      id: 1,
      subject: "Reset Your Password",
      recipient: user.email,
      body: {
        url: "dummy-url",
      },
    });
    expect(result).toMatchObject({
      message: Messages.SENT_FORGOT_PASSWORD_EMAIL,
      statusCode: 200,
    });
    expect(result.nextAllowedAt).toBeDefined();
  });
});
