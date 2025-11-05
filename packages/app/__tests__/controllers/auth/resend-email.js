const { resendEmail } = require("../../../controllers/auth");
const { UserService, UserTokenService } = require("../../../services");
const { MOCK_USERS, MOCK_USERTOKENS } = require("../../../utils/mocks");
const sendEmail = require("../../../utils/sendEmail");
const dayjs = require("dayjs");

jest.mock("../../../utils/sendEmail");

describe("resendEmail Function", () => {
  let userService;
  let userTokenService;
  let mockNext;

  beforeEach(() => {
    userService = new UserService();
    userTokenService = new UserTokenService();

    mockNext = jest.fn();
    sendEmail.mockResolvedValue(true);
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    it("201 - Successfully resend email when 24 hours passed", async () => {
      const mockUser = {
        _id: MOCK_USERS[0]._id,
        email: "test@example.com",
        resend_email_count: 2,
        last_verification_email_sent_at: dayjs().subtract(25, "hour").toDate(),
      };

      const mockToken = {
        _id: MOCK_USERTOKENS[0]._id,
        token: MOCK_USERTOKENS[0].token,
        user_id: mockUser._id,
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=abc123"),
      };

      const mockUpdatedToken = {
        ...mockToken,
        token: "new-token-123",
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=new-token-123"),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);
      userTokenService.updateUserToken = jest
        .fn()
        .mockResolvedValue(mockUpdatedToken);
      userService.updateUserEmailCount = jest.fn().mockResolvedValue(true);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: true,
        message: "Resent a new Verification Email.",
        statusCode: 201,
      });
      expect(userTokenService.fetchUserTokenByUserId).toHaveBeenCalledWith(
        mockUser._id
      );
      expect(userService.updateUserEmailCount).toHaveBeenCalledWith(
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
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("201 - Successfully resend email when count is less than 3", async () => {
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
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=abc123"),
      };

      const mockUpdatedToken = {
        ...mockToken,
        token: "new-token-456",
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=new-token-456"),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);
      userTokenService.updateUserToken = jest
        .fn()
        .mockResolvedValue(mockUpdatedToken);
      userService.updateUserEmailCount = jest.fn().mockResolvedValue(true);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: true,
        message: "Resent a new Verification Email.",
        statusCode: 201,
      });
      expect(userService.updateUserEmailCount).toHaveBeenCalledWith(
        mockUser,
        false
      );
      expect(userTokenService.updateUserToken).toHaveBeenCalledWith(
        mockToken.token
      );
      expect(sendEmail).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("Error Cases", () => {
    it("404 - Token not found for user", async () => {
      const mockUser = {
        _id: MOCK_USERS[0]._id,
        email: "test@example.com",
        resend_email_count: 0,
        last_verification_email_sent_at: dayjs().subtract(1, "hour").toDate(),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(null);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: false,
        message: "Invalid token.",
        statusCode: 404,
      });
      expect(userTokenService.fetchUserTokenByUserId).toHaveBeenCalledWith(
        mockUser._id
      );
      expect(sendEmail).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("429 - Too many requests (resend count >= 3 within 24 hours)", async () => {
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
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=abc123"),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: false,
        message: "Try again after 24 hours.",
        statusCode: 429,
      });
      expect(userTokenService.fetchUserTokenByUserId).toHaveBeenCalledWith(
        mockUser._id
      );
      expect(sendEmail).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("400 - Failed to update token", async () => {
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
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=abc123"),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);
      userTokenService.updateUserToken = jest.fn().mockResolvedValue(null);
      userService.updateUserEmailCount = jest.fn().mockResolvedValue(true);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: false,
        message: "Failed to update token.",
        statusCode: 400,
      });
      expect(userTokenService.updateUserToken).toHaveBeenCalledWith(
        mockToken.token
      );
      expect(sendEmail).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("500 - Internal server error during execution", async () => {
      const mockUser = {
        _id: MOCK_USERS[0]._id,
        email: "test@example.com",
        resend_email_count: 1,
        last_verification_email_sent_at: dayjs().subtract(2, "hour").toDate(),
      };

      const mockError = new Error("Database connection failed");

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockRejectedValue(mockError);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: false,
        message: "Failed to resend verification email.",
        statusCode: 500,
      });
      expect(mockNext).toHaveBeenCalledWith(mockError);
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("201 - Exactly 24 hours passed (boundary test)", async () => {
      const mockUser = {
        _id: MOCK_USERS[0]._id,
        email: "test@example.com",
        resend_email_count: 2,
        last_verification_email_sent_at: dayjs().subtract(24, "hour").toDate(),
      };

      const mockToken = {
        _id: MOCK_USERTOKENS[0]._id,
        token: MOCK_USERTOKENS[0].token,
        user_id: mockUser._id,
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=abc123"),
      };

      const mockUpdatedToken = {
        ...mockToken,
        token: "new-token-789",
        tokenURL: jest
          .fn()
          .mockReturnValue("http://example.com/verify?token=new-token-789"),
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);
      userTokenService.updateUserToken = jest
        .fn()
        .mockResolvedValue(mockUpdatedToken);
      userService.updateUserEmailCount = jest.fn().mockResolvedValue(true);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: true,
        message: "Resent a new Verification Email.",
        statusCode: 201,
      });
      expect(userService.updateUserEmailCount).toHaveBeenCalledWith(
        mockUser,
        true
      );
    });

    it("429 - Exactly 3 resend attempts within 24 hours (boundary test)", async () => {
      const mockUser = {
        _id: MOCK_USERS[0]._id,
        email: "test@example.com",
        resend_email_count: 3,
        last_verification_email_sent_at: dayjs().subtract(23, "hour").toDate(),
      };

      const mockToken = {
        _id: MOCK_USERTOKENS[0]._id,
        token: MOCK_USERTOKENS[0].token,
        user_id: mockUser._id,
      };

      userTokenService.fetchUserTokenByUserId = jest
        .fn()
        .mockResolvedValue(mockToken);

      const result = await resendEmail(
        mockUser,
        userService,
        userTokenService,
        mockNext
      );

      expect(result).toEqual({
        success: false,
        message: "Try again after 24 hours.",
        statusCode: 429,
      });
    });
  });
});
