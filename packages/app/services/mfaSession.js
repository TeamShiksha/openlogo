const crypto = require("crypto");
const VerificationSessionRepository = require("../repositories/verificationSession");
const { TEMPORARY_SESSION_TYPES } = require("../utils/constants");

class MfaVerificationSessionService {
  constructor() {
    this.verificationSessionRepository = new VerificationSessionRepository();
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
   * @param {string} [params.verificationToken] - Verification Token
   * @returns {Promise<Object>} - Created session object.
   */
  async createSession({ userId }) {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return await this.verificationSessionRepository.create({
      userId,
      sessionId,
      sessionType: this.TEMPORARY_SESSION_TYPES.MFA,
      expiresAt,
    });
  }

  async findAndUpdateActiveSession(sessionId) {
    return await this.verificationSessionRepository.findAndUpdateActiveSession({
      sessionType: this.TEMPORARY_SESSION_TYPES.MFA,
      sessionId,
    });
  }
}

module.exports = MfaVerificationSessionService;
