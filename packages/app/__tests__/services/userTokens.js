const UserToken = require("../../models/usertoken");
const { UserTokenRepository } = require("../../repositories");
const UserTokenService = require("../../services/usertoken");
const { UserTokenTypes, Messages } = require("../../utils/constants");
const { MOCK_USERTOKENS, MOCK_USERS } = require("../../utils/mocks");
const dayjs = require("dayjs");
const sendEmail = require("../../utils/sendEmail");
jest.mock("../../utils/sendEmail");

describe("User Token Service", () => {
  let userTokenService;
  let mockUserService;

  beforeEach(() => {
    userTokenService = new UserTokenService();
    jest.clearAllMocks();
    sendEmail.mockResolvedValue(true);
    mockUserService = {
      updateUserEmailCount: jest.fn().mockResolvedValue(true),
    };
  });

  it("create a new user token succesfully whose default value is VERIFY", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "create")
      .mockResolvedValue(userToken);

    const result = await userTokenService.createUserToken(userToken.user_id);

    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
    expect(result.is_deleted).toBe(false);
  });

  it("should fetch a user token successfully for valid token", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserToken")
      .mockResolvedValue(userToken);

    const result = await userTokenService.fetchUserToken(userToken.token);

    expect(result).toBeDefined();
    expect(result._id).toBe(userToken._id);
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should return null if no user token found", async () => {
    const userToken = "invalid-token";

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserToken")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchUserToken(userToken);

    expect(result).toBe(null);
  });

  it("should fetch a deleted user token if valid token is provided", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[4]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(userToken);
    const result = await userTokenService.fetchDeletedUserToken(
      userToken.token
    );

    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
    expect(result.is_deleted).toBe(true);
  });

  it("should return null if invalid token is provided", async () => {
    const userToken = "invalid-token";

    jest
      .spyOn(UserTokenRepository.prototype, "fetchDeletedUserToken")
      .mockResolvedValue(null);

    const result = await userTokenService.fetchDeletedUserToken(userToken);

    expect(result).toBe(null);
  });

  it("should delete user token successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);
    const updatedTokenData = { ...userToken.toObject(), is_deleted: true };

    jest
      .spyOn(UserTokenRepository.prototype, "update")
      .mockResolvedValue(updatedTokenData);

    const result = await userTokenService.deleteUserToken(userToken);
    expect(result).toBeDefined();
    expect(result.is_deleted).toBe(true);
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should create a forgot user token succesfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[5]);

    jest
      .spyOn(UserTokenRepository.prototype, "create")
      .mockResolvedValue(userToken);

    const result = await userTokenService.createForgotToken(userToken.user_id);
    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.FORGOT);
    expect(result.user_id).toBe("user@5");
  });

  it("should fetch user token by user id successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[0]);

    jest
      .spyOn(UserTokenRepository.prototype, "fetchUserTokenByUserId")
      .mockResolvedValue(userToken);

    const result = await userTokenService.fetchUserTokenByUserId(
      userToken.user_id
    );
    expect(result).toBeDefined();
    expect(result.type).toBe(UserTokenTypes.VERIFY);
  });

  it("should update user token successfully", async () => {
    const userToken = new UserToken(MOCK_USERTOKENS[1]);
    const updatedExpireAt = dayjs().add(1, "day").toDate();

    jest
      .spyOn(UserTokenRepository.prototype, "updateUserToken")
      .mockResolvedValue({
        ...userToken.toObject(),
        expire_at: updatedExpireAt,
      });

    const result = await userTokenService.updateUserToken(userToken.token);
    expect(result).toBeDefined();
    expect(result.expire_at).toEqual(updatedExpireAt);
  });

  it("should successfully resend email when 24 hours have passed", async () => {
    const mockUser = {
      _id: MOCK_USERS[0]._id,
      email: "test@example.com",
      resend_email_count: 5,
      last_verification_email_sent_at: dayjs().subtract(25, "hour").toDate(),
    };
    const mockToken = {
      _id: MOCK_USERTOKENS[0]._id,
      token: MOCK_USERTOKENS[0].token,
      user_id: mockUser._id,
    };
    const mockUpdatedToken = {
      ...mockToken,
      token: "new-token-123",
      tokenURL: jest
        .fn()
        .mockReturnValue("http://example.com/verify?token=new-token-123"),
    };

    jest
      .spyOn(userTokenService, "fetchUserTokenByUserId")
      .mockResolvedValue(mockToken);
    jest
      .spyOn(userTokenService, "updateUserToken")
      .mockResolvedValue(mockUpdatedToken);

    const result = await userTokenService.resendVerificationEmail(
      mockUser,
      mockUserService
    );

    expect(result).toEqual({
      success: true,
      message: Messages.RESEND_EMAIL,
    });
    expect(userTokenService.fetchUserTokenByUserId).toHaveBeenCalledWith(
      mockUser._id
    );
    expect(mockUserService.updateUserEmailCount).toHaveBeenCalledWith(
      mockUser,
      true
    );
    expect(userTokenService.updateUserToken).toHaveBeenCalledWith(
      mockToken.token
    );
    expect(sendEmail).toHaveBeenCalledWith({
      id: 2,
      subject: "Openlogo: Email Verification",
      recipient: mockUser.email,
      body: {
        url: mockUpdatedToken.tokenURL(),
      },
    });
  });
  it("should successfully resend email when count is less than 3", async () => {
    const mockUser = {
      _id: MOCK_USERS[0]._id,
      email: "test@example.com",
      resend_email_count: 2,
      last_verification_email_sent_at: dayjs().subtract(5, "hour").toDate(),
    };

    const mockToken = {
      _id: MOCK_USERTOKENS[0]._id,
      token: MOCK_USERTOKENS[0].token,
      user_id: mockUser._id,
    };

    const mockUpdatedToken = {
      ...mockToken,
      tokenURL: jest
        .fn()
        .mockReturnValue("http://example.com/verify?token=abc123"),
    };

    jest
      .spyOn(userTokenService, "fetchUserTokenByUserId")
      .mockResolvedValue(mockToken);
    jest
      .spyOn(userTokenService, "updateUserToken")
      .mockResolvedValue(mockUpdatedToken);

    const result = await userTokenService.resendVerificationEmail(
      mockUser,
      mockUserService
    );

    expect(result).toEqual({
      success: true,
      message: Messages.RESEND_EMAIL,
    });
    expect(mockUserService.updateUserEmailCount).toHaveBeenCalledWith(
      mockUser,
      false
    );
    expect(userTokenService.updateUserToken).toHaveBeenCalledWith(
      mockToken.token
    );
    expect(sendEmail).toHaveBeenCalled();
  });

  it("should throw TOKEN_NOT_FOUND error when token does not exist", async () => {
    const mockUser = {
      _id: MOCK_USERS[0]._id,
      email: "test@example.com",
      resend_email_count: 1,
      last_verification_email_sent_at: dayjs().subtract(2, "hour").toDate(),
    };

    jest
      .spyOn(userTokenService, "fetchUserTokenByUserId")
      .mockResolvedValue(null);

    await expect(
      userTokenService.resendVerificationEmail(mockUser, mockUserService)
    ).rejects.toThrow(Messages.INVALID_TOKEN);

    try {
      await userTokenService.resendVerificationEmail(mockUser, mockUserService);
    } catch (err) {
      expect(err.statusCode).toBe(404);
    }

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should throw RATE_LIMIT_EXCEEDED error when resend count >= 3 within 24 hours", async () => {
    const mockUser = {
      _id: MOCK_USERS[0]._id,
      email: "test@example.com",
      resend_email_count: 3,
      last_verification_email_sent_at: dayjs().subtract(5, "hour").toDate(),
    };
    const mockToken = {
      _id: MOCK_USERTOKENS[0]._id,
      token: MOCK_USERTOKENS[0].token,
      user_id: mockUser._id,
    };

    jest
      .spyOn(userTokenService, "fetchUserTokenByUserId")
      .mockResolvedValue(mockToken);

    await expect(
      userTokenService.resendVerificationEmail(mockUser, mockUserService)
    ).rejects.toThrow(Messages.TRY_AGAIN);

    try {
      await userTokenService.resendVerificationEmail(mockUser, mockUserService);
    } catch (err) {
      expect(err.statusCode).toBe(429);
    }

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("should throw TOKEN_UPDATE_FAILED error when token update fails", async () => {
    const mockUser = {
      _id: MOCK_USERS[0]._id,
      email: "test@example.com",
      resend_email_count: 1,
      last_verification_email_sent_at: dayjs().subtract(2, "hour").toDate(),
    };
    const mockToken = {
      _id: MOCK_USERTOKENS[0]._id,
      token: MOCK_USERTOKENS[0].token,
      user_id: mockUser._id,
    };

    jest
      .spyOn(userTokenService, "fetchUserTokenByUserId")
      .mockResolvedValue(mockToken);
    jest.spyOn(userTokenService, "updateUserToken").mockResolvedValue(null);

    await expect(
      userTokenService.resendVerificationEmail(mockUser, mockUserService)
    ).rejects.toThrow(Messages.FAILED_UPDATE_TOKEN);

    try {
      await userTokenService.resendVerificationEmail(mockUser, mockUserService);
    } catch (err) {
      expect(err.statusCode).toBe(400);
    }

    expect(userTokenService.updateUserToken).toHaveBeenCalledWith(
      mockToken.token
    );
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
