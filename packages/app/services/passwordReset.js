const crypto = require("crypto");
const VerificationSessionRepository = require("../repositories/verificationSession");
const { TEMPORARY_SESSION_TYPES } = require("../utils/constants");
class PasswordResetSessionService {
  constructor() {
    this.PasswordResetRepository = new VerificationSessionRepository();
    this.TEMPORARY_SESSION_TYPES = TEMPORARY_SESSION_TYPES;
  }
  /**
   * Generates a cryptographically secure session ID.
   * @returns {string} - Random session identifier.
   */
  generateSessionId() {
    return crypto.randomBytes(64).toString("hex");
  }
  /**
   * Creates a new user session.
   * @param {Object} params
   * @param {string} params.userId - User ID.
   * @param {string} [params.resetToken] - Reset Token
   * @returns {Promise<Object>} - Created session object.
   */
  async createSession({ userId, resetToken }) {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return await this.PasswordResetRepository.create({
      userId,
      sessionId,
      sessionType: this.TEMPORARY_SESSION_TYPES.PASSWORD_RESET,
      token: resetToken,
      expiresAt,
    });
  }

  async findAndUpdateActiveSession(sessionId) {
    return await this.PasswordResetRepository.findAndUpdateActiveSession({
      sessionType: this.TEMPORARY_SESSION_TYPES.PASSWORD_RESET,
      sessionId,
    });
  }
}

module.exports = PasswordResetSessionService;
