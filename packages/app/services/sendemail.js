const UserTokenService = require("./usertoken");
const UserService = require("./users");
const { Messages } = require("../utils/constants");
const sendEmail = require("../utils/sendEmail");
const { UserTokenTypes } = require("../utils/constants");
const dayjs = require("dayjs");

class SendEmailService {
  constructor() {
    this.userTokenService = new UserTokenService();
    this.userService = new UserService();
  }

  /**
   * Sends a verification email to the user.
   * Fetches the user's verification token, validates it, refreshes it if expired,
   * and sends a new verification email. Returns an error object on failure.
   * @param {Object} user - The user to send the verification email to.
   * @returns {Promise<Object|Error>} - Success response or an Error with statusCode.
   */
  async sendVerificationEmail(user) {
    const userToken =
      await this.userTokenService.fetchUserTokenByUserIdTokenType(
        user._id,
        UserTokenTypes.VERIFY
      );

    if (!userToken) {
      const error = new Error(Messages.INVALID_TOKEN);
      error.statusCode = 404;
      return error;
    }

    if (!userToken.isExpired()) {
      const error = new Error(Messages.EMAIL_NOT_VERIFIED);
      error.statusCode = 429;
      return error;
    }

    const updatedToken = await this.userTokenService.updateUserToken(userToken);
    if (!updatedToken) {
      const error = new Error(Messages.FAILED_UPDATE_TOKEN);
      error.statusCode = 400;
      return error;
    }

    await sendEmail({
      id: 2,
      subject: "Openlogo: Email Verification",
      recipient: user.email,
      body: {
        url: updatedToken.tokenURL(),
      },
    });

    return {
      success: true,
      message: Messages.RESEND_EMAIL,
    };
  }

  /**
   * Sends a forgot password email to the user.
   * Enforces cooldown limits, daily attempt limits, resets counters when needed,
   * refreshes or creates a token, updates attempt tracking, and sends the email.
   * Returns an error object when rate-limited or invalid.
   *
   * @param {Object} user - The user requesting a password reset.
   * @returns {Promise<Object|Error>} - Success response or an Error with statusCode.
   */
  async sendForgotPasswordEmail(user) {
    const RESET_WINDOW_HOURS = 24;
    const COOLDOWN_MS = 2 * 60 * 1000;
    const now = dayjs();

    let reset = false;
    if (user.forgot_password_last_reset_at) {
      const lastSent = dayjs(user.forgot_password_last_reset_at);
      const timeSinceLast = now.diff(lastSent, "hour");
      if (timeSinceLast >= RESET_WINDOW_HOURS) {
        reset = true;
      }
    }

    let tokenDoc = await this.userTokenService.fetchUserTokenByUserIdTokenType(
      user._id,
      UserTokenTypes.FORGOT
    );

    if (tokenDoc) {
      tokenDoc = await this.userTokenService.updateUserToken(tokenDoc);
    } else {
      tokenDoc = await this.userTokenService.createForgotToken(user._id);
    }

    const updatedUser =
      await this.userService.updateUserFortgotPasswordAttempts(user, reset);
    if (!updatedUser) {
      const lastAttempt = user.forgot_password_last_reset_at
        ? dayjs(user.forgot_password_last_reset_at)
        : null;

      const timeSinceLastAttempt = lastAttempt
        ? now.diff(lastAttempt, "millisecond")
        : COOLDOWN_MS + 1;

      if (timeSinceLastAttempt < COOLDOWN_MS) {
        const error = new Error(Messages.TOO_MANY_REQUESTS);
        error.statusCode = 429;
        error.nextAllowedAt = lastAttempt.add(2, "minute").toISOString();
        return error;
      }

      const error = new Error(Messages.TRY_AGAIN);
      error.statusCode = 429;
      return error;
    }

    await sendEmail({
      id: 1,
      subject: "Reset Your Password",
      recipient: user.email,
      body: {
        url: tokenDoc.tokenURL(),
      },
    });

    return {
      message: Messages.SENT_FORGOT_PASSWORD_EMAIL,
      statusCode: 200,
      nextAllowedAt: now.add(2, "minute").toISOString(),
    };
  }
}

module.exports = SendEmailService;
