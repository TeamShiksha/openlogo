const mongoose = require("mongoose");
const { TEMPORARY_SESSION_TYPES } = require("../utils/constants");

/**
 * VerificationSession Model
 * Represents short-lived authentication flows
 * (PASSWORD_RESET, MFA, etc.)
 *
 * NOT an authenticated user session.
 */
const verificationSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  sessionType: {
    type: String,
    enum: Object.values(TEMPORARY_SESSION_TYPES),
    required: true,
  },

  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

  token: {
    type: String,
    required: function () {
      return this.sessionType === TEMPORARY_SESSION_TYPES.PASSWORD_RESET;
    },
  },

  usedAt: {
    type: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // TTL,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

// indexes
verificationSessionSchema.index({ sessionType: 1, sessionId: 1 });

module.exports = mongoose.model(
  "VerificationSession",
  verificationSessionSchema
);
