const BaseRepository = require("./base");
const VerificationSession = require("../models/verificationSession");

/**
 * PasswordResetRepository handles database operations for the
 * PasswordResetSession model.
 * It extends BaseRepository to reuse common CRUD methods.
 *
 * This repository includes reset-session–specific methods such as:
 *  - Finding an active reset session
 *  - Deactivating reset sessions after use
 */
class VerificationSessionRepository extends BaseRepository {
  constructor() {
    super(VerificationSession);
  }

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
