const mongoose = require("mongoose");

/**
 * UserSession Model
 * Represents an active authenticated session for a device.
 * Tracks session activity, TTL, and soft logout.
 * 'isActive' marks whether the session is currently valid.
 */
const userSessionSchema = new mongoose.Schema({
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

  isActive: {
    type: Boolean,
    default: true,
  },

  lastActivityAt: {
    type: Date,
    default: Date.now,
  },

  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // TTL
  },
});

module.exports = mongoose.model("userSession", userSessionSchema);
