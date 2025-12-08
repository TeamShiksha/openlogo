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

  async sendVerificationEmail(user) {
    const userToken = await this.userTokenService.fetchUserTokenByUserId(
      user._id,
      UserTokenTypes.VERIFY
    );

    if (!userToken) {
      const error = new Error(Messages.INVALID_TOKEN);
      error.statusCode = 404;
      throw error;
    }

    if (!userToken.isExpired()) {
      const error = new Error(Messages.EMAIL_NOT_VERIFIED);
      error.statusCode = 429;
      throw error;
    }

    const updatedToken = await this.userTokenService.updateUserToken(userToken);
    if (!updatedToken) {
      const error = new Error(Messages.FAILED_UPDATE_TOKEN);
      error.statusCode = 400;
      throw error;
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

  async sendForgotPasswordEmail(user) {
    const MAX_ATTEMPTS_PER_DAY = 2;
    const RESET_WINDOW_HOURS = 24;
    const COOLDOWN_MS = 2 * 60 * 1000;

    const now = dayjs();
    const lastSent = dayjs(user.forgot_password_last_reset_at);
    const timeSinceLast = now.diff(lastSent, "hour");

    if (
      user.forgot_password_last_reset_at &&
      timeSinceLast >= RESET_WINDOW_HOURS
    ) {
      user.forgot_password_attempts = 0;
      await user.save();
    }

    if (
      user.forgot_password_last_reset_at &&
      now.diff(lastSent) < COOLDOWN_MS
    ) {
      const nextAllowedAt = lastSent.add(2, "minute").toISOString();
      const error = new Error(
        `Too many requests. Please try again after ${nextAllowedAt}.`
      );
      error.statusCode = 429;
      error.nextAllowedAt = nextAllowedAt;
      throw error;
    }

    if (user.forgot_password_attempts >= MAX_ATTEMPTS_PER_DAY) {
      const error = new Error(
        "Limit exceeded. You can request a forgot-password email only twice in 24 hours."
      );
      error.statusCode = 429;
      throw error;
    }

    let tokenDoc = await this.userTokenService.fetchUserTokenByUserId(
      user._id,
      UserTokenTypes.FORGOT
    );

    if (tokenDoc) {
      // Update expiry to 10 minutes
      tokenDoc.expire_at = dayjs().add(10, "minute").toDate();
      await tokenDoc.save();
    } else {
      // Create new token with 10-minute expiry
      tokenDoc = await this.userTokenService.createForgotToken(user._id);
    }

    user.forgot_password_attempts += 1;
    user.forgot_password_last_reset_at = now.toDate();
    await user.save();

    await sendEmail({
      id: 1,
      subject: "Reset Your Password",
      recipient: user.email,
      body: {
        url: tokenDoc.tokenURL(),
      },
    });

    return {
      success: true,
      message: "Email sent successfully",
      nextAllowedAt: lastSent.add(2, "minute").toISOString(),
    };
  }
}

module.exports = SendEmailService;
