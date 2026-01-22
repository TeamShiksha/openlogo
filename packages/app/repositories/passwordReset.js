const BaseRepository = require("./base");
const PasswordResetSession = require("../models/passwordResetSession");

/**
 * PasswordResetRepository handles database operations for the
 * PasswordResetSession model.
 * It extends BaseRepository to reuse common CRUD methods.
 *
 * This repository includes reset-session–specific methods such as:
 *  - Finding an active reset session
 *  - Deactivating reset sessions after use
 */
class PasswordResetRepository extends BaseRepository {
  constructor() {
    super(PasswordResetSession);
  }

  /**
   * Find active reset session by sessionId
   * @param {string} sessionId
   */
  async findActiveBySessionId(sessionId) {
    return await this.model
      .findOne({
        sessionId,
        isActive: true,
        expiresAt: { $gt: new Date() },
      })
      .populate("userId");
  }

  /**
   * Deactivate reset session by sessionId
   * @param {string} sessionId
   */
  async deactivateSession(sessionId) {
    return await this.model.findOneAndUpdate(
      { sessionId, isActive: true },
      { isActive: false }
    );
  }

  /**
   * Deactivate all active reset sessions for a user
   * @param {string} userId
   */
  async deactivateAllActiveSessions(userId) {
    return await this.model.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );
  }
}

module.exports = PasswordResetRepository;
