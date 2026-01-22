const crypto = require("crypto");
const PasswordResetRepository = require("../repositories/passwordReset");
class PasswordResetSessionService {
  constructor() {
    this.PasswordResetRepository = new PasswordResetRepository();
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
    // deactivate previous sessions
    await this.PasswordResetRepository.deactivateAllActiveSessions(userId);

    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return await this.PasswordResetRepository.create({
      userId,
      resetToken,
      sessionId,
      expiresAt,
    });
  }

  async findActiveSessionById(sessionId) {
    return await this.PasswordResetRepository.findActiveBySessionId(sessionId);
  }

  async deactivateSession(sessionId) {
    return await this.PasswordResetRepository.deactivateSession(sessionId);
  }
}

module.exports = PasswordResetSessionService;
