const mongoose = require("mongoose");

/**
 * PasswordResetSession Model
 * Represents a short-lived session used for resetting a user's password.
 * Tracks reset token validity, TTL, and one-time usage.
 * 'isActive' marks whether the reset session is still valid.
 */
const passwordResetSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },

  sessionId: {
    type: String,
    required: true,
    unique: true,
  },

  resetToken: {
    type: String,
    required: true,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // TTL
  },
});

module.exports = mongoose.model(
  "passwordResetSession",
  passwordResetSessionSchema
);
