const { v4 } = require("uuid");
const { UserTokenRepository } = require("../repositories");
const { UserTokenTypes, ErrorTypes } = require("../utils/constants");
const { Messages } = require("../utils/constants");
const sendEmail = require("../utils/sendEmail");
const dayjs = require("dayjs");

class UserTokenService {
  constructor() {
    this.userTokenRepository = new UserTokenRepository();
  }

  async createUserToken(userId) {
    const tokenData = {
      user_id: userId,
      token: v4().replaceAll("-", ""),
      type: UserTokenTypes.VERIFY,
    };
    return await this.userTokenRepository.create(tokenData);
  }

  async fetchUserToken(token) {
    return await this.userTokenRepository.fetchUserToken(token);
  }

  async fetchDeletedUserToken(token) {
    return await this.userTokenRepository.fetchDeletedUserToken(token);
  }

  async fetchUserTokenByUserId(userId) {
    return await this.userTokenRepository.fetchUserTokenByUserId(userId);
  }

  async updateUserToken(token) {
    return await this.userTokenRepository.updateUserToken(token);
  }

  async deleteUserToken(userToken) {
    const deleteUserTokenData = {
      is_deleted: true,
    };
    return await this.userTokenRepository.update(
      userToken._id,
      deleteUserTokenData
    );
  }

  async createForgotToken(userId) {
    return await this.userTokenRepository.create({
      user_id: userId,
      token: v4().replaceAll("-", ""),
      type: UserTokenTypes.FORGOT,
    });
  }

  /**
   * Resends verification email to the user with rate limiting.
   * @param {Object} user - The user object.
   * @param {Object} userService - The UserService instance for updating user email count.
   * @returns {Promise<Object>} - Returns result object with success status and error type if failed.
   * @throws {Error} - Throws error with type property for different failure scenarios.
   */

  async resendVerificationEmail(user, userService) {
    const userToken = await this.fetchUserTokenByUserId(user._id);

    if (!userToken) {
      const error = new Error(Messages.INVALID_TOKEN);
      error.type = ErrorTypes.TOKEN_NOT_FOUND;
      throw error;
    }

    const now = dayjs();
    const lastSent = dayjs(user.last_verification_email_sent_at);
    const hoursSinceLastEmail = now.diff(lastSent, "hour");

    if (hoursSinceLastEmail >= 24) {
      await userService.updateUserEmailCount(user, true);
    } else if (user.resend_email_count >= 3) {
      const error = new Error(Messages.TRY_AGAIN);
      error.type = ErrorTypes.RATE_LIMIT_EXCEEDED;
      throw error;
    } else {
      await userService.updateUserEmailCount(user, false);
    }

    const updatedToken = await this.updateUserToken(userToken.token);
    if (!updatedToken) {
      const error = new Error(Messages.FAILED_UPDATE_TOKEN);
      error.type = ErrorTypes.TOKEN_UPDATE_FAILED;
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
}

module.exports = UserTokenService;
