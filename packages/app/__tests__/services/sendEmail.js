const SendEmailService = require("../../services/sendemail");
//const UserService = require("../../services/users");
const UserTokenService = require("../../services/usertoken");
const User = require("../../models/users");
const UserToken = require("../../models/usertoken");
const { MOCK_USERS, MOCK_USERTOKENS } = require("../../utils/mocks");
const sendEmail = require("../../utils/sendEmail");
const { Messages } = require("../../utils/constants");

jest.mock("../../utils/sendEmail");

describe("Send Email Service", () => {
  let sendEmailService;

  beforeEach(() => {
    sendEmailService = new SendEmailService();
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
  });

  it("Should fail to send verification email if user token is not found", async () => {
    // Arrange
    const user = new User(MOCK_USERS[0]);

    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(null);
    // Act
    const result = await sendEmailService.sendVerificationEmail(user);

    // Assert
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.INVALID_TOKEN);
    expect(result.statusCode).toBe(404);
  });

  it("Should fail to send verification email if user token is not expired", async () => {
    // Arrange
    const user = new User(MOCK_USERS[0]);
    const mockToken = new UserToken({
      ...MOCK_USERTOKENS[0],
    });

    mockToken.isExpired = jest.fn().mockReturnValue(false);

    jest
      .spyOn(UserTokenService.prototype, "fetchUserTokenByUserIdTokenType")
      .mockResolvedValue(mockToken);

    //Act
    const result = await sendEmailService.sendVerificationEmail(user);

    // Assert
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.EMAIL_NOT_VERIFIED);
    expect(result.statusCode).toBe(429);
  });

  it("Should fail to send verification email if failed to update token", async () => {
    // Arrange
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

    //Act
    const result = await sendEmailService.sendVerificationEmail(user);

    // Assert
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(Messages.FAILED_UPDATE_TOKEN);
    expect(result.statusCode).toBe(400);
  });

  it("Should send verification email if all checks pass", async () => {
    // Arrange
    process.env.CLIENT_URL = "https://client.com";

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

    // Act
    const result = await sendEmailService.sendVerificationEmail(user);

    // Assert
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
});
