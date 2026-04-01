const mongoose = require("mongoose");

/**
 * UserSession Model
 * Represents an active authenticated session for a specific device/browser.
 * Tracks session activity, device metadata, IP address, TTL, and soft logout.
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

  expiresAt: {
    type: Date,
    required: true,
    expires: 0, // TTL index — MongoDB auto-removes expired documents
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Device/browser metadata parsed from the User-Agent header at sign-in time.
  // Used to display human-readable session info in the "Manage Sessions" UI.
  deviceInfo: {
    browser: { type: String, default: "Unknown" },
    os: { type: String, default: "Unknown" },
    deviceType: { type: String, default: "Unknown" }, // desktop | mobile | tablet
  },

  // The IP address of the client at sign-in time. Informational only —
  // never used for auth decisions to avoid IP-spoofing security risks.
  ipAddress: { type: String, default: null },

  // Tracks when the session was last seen active. Updated (throttled) by
  // the auth middleware on every validated request.
  lastActiveAt: { type: Date, default: Date.now },
});

// Compound index for efficient per-user active-session lookups
// (used by findAllActiveSessionsByUser and session limit enforcement).
userSessionSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model("userSession", userSessionSchema);
