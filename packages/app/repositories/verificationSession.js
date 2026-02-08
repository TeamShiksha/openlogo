const BaseRepository = require("./base");
const VerificationSession = require("../models/verificationSession");

/**
 * VerificationSessionRepository handles database operations
 * related to verification sessions (e.g. password reset,
 * email verification, etc.).
 *
 * It extends BaseRepository to reuse common CRUD functionality.
 *
 * This repository provides session-specific logic such as:
 *  - Finding an active (unused & unexpired) verification session
 *  - Marking a session as used once it is consumed
 */
class VerificationSessionRepository extends BaseRepository {
  constructor() {
    super(VerificationSession);
  }

  /**
   * Finds an active verification session by sessionId and sessionType,
   * marks it as used, and returns the updated session.
   *
   * A session is considered active if:
   *  - it has not been used yet
   *  - it has not expired
   */
  async findAndUpdateActiveSession({ sessionType, sessionId }) {
    return await this.model
      .findOneAndUpdate(
        {
          sessionId,
          sessionType,
          usedAt: null,
          expiresAt: { $gt: new Date() },
        },
        {
          $set: { usedAt: new Date() },
        },
        { new: true }
      )
      .populate("userId");
  }
}

module.exports = VerificationSessionRepository;
