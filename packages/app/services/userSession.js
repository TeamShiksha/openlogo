// services/userSession.js
const crypto = require("crypto");
const UserSessionRepository = require("../repositories/userSession");

class UserSessionService {
  constructor() {
    this.userSessionRepository = new UserSessionRepository();
  }

  generateSessionId() {
    return crypto.randomBytes(64).toString("hex");
  }

  async createSession({ userId, deviceId }) {
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return await this.userSessionRepository.create({
      userId,
      deviceId,
      sessionId,
      expiresAt,
    });
  }

  async validateSession(sessionId) {
    return await this.userSessionRepository.findBySessionId(sessionId);
  }

  async userActiveSession(userId) {
    return await this.userSessionRepository.findActiveSessionByUser(userId);
  }

  async signout(sessionId) {
    return await this.userSessionRepository.deactivateSession(sessionId);
  }
}

module.exports = UserSessionService;
