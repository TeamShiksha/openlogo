// services/userSession.js
const crypto = require("crypto");
const UserSessionRepository = require("../repositories/userSession");

class UserSessionService {
  constructor() {
    this.userSessionRepository = new UserSessionRepository();
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
   * @returns {Promise<Object>} - Created session object.
   */
  async createSession({ userId }) {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return await this.userSessionRepository.create({
      userId,
      sessionId,
      expiresAt,
    });
  }

  /**
   * Validates a session using sessionId.
   * @param {string} sessionId - Session identifier.
   * @returns {Promise<Object|null>} - Active session or null.
   */
  async validateSession(sessionId) {
    return await this.userSessionRepository.findBySessionId(sessionId);
  }

  /**
   * Fetches an active session for a user if one exists.
   * @param {string} userId - User ID.
   * @returns {Promise<Object|null>} - Active session or null.
   */
  async userActiveSession(userId) {
    return await this.userSessionRepository.findActiveSessionByUser(userId);
  }

  /**
   * Deactivates a user session (logout).
   * @param {string} sessionId - Session identifier.
   * @returns {Promise<Object>} - Updated session object.
   */
  async signout(sessionId) {
    return await this.userSessionRepository.deactivateSession(sessionId);
  }
}

module.exports = UserSessionService;
