// repositories/userSession.js
const BaseRepository = require("./base");
const UserSession = require("../models/userSession");
const { USER_SAFE_FIELDS } = require("../utils/constants");

/**
 * UserSessionRepository handles database operations for the UserSession model.
 * It extends BaseRepository to reuse common CRUD methods.
 *
 * This repository includes session-specific methods such as:
 *  - Finding an active session
 *  - Deactivating sessions
 *  - Getting all active sessions for a user
 */

class UserSessionRepository extends BaseRepository {
  constructor() {
    super(UserSession);
  }

  /**
   * Find active session by sessionId
   * @param {string} sessionId
   * @param {Object} options
   * @param {boolean} options.populateUser - to populate userId
   */

  async findBySessionId(sessionId) {
    return await this.model
      .findOne({
        sessionId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .populate("userId", USER_SAFE_FIELDS);
  }

  /**
   * Deactivate session by sessionId
   * @param {string} sessionId
   */
  async deactivateSession(sessionId) {
    return await this.model.findOneAndUpdate(
      { sessionId },
      { isActive: false },
      { new: true }
    );
  }

  /**
   * Deactivate all sessions by userId
   * @param {string} userId
   */
  async deactivateAllUserSessions(userId) {
    return await this.model.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
  }

  async findActiveSessionByUser(userId) {
    return await this.model.findOne({
      userId,
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
  }
}

module.exports = UserSessionRepository;
