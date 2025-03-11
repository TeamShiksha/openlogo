const mongoose = require("mongoose");
const { UserType } = require("../utils/constants");

/**
 * GuestUser Model: Represents guest users in the application.
 * This model manages guest user registration and removal.
 */

const guestUserSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    default: UserType.GUEST,
  },
  deviceID: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "15min",
  },
});

const GuestUser = mongoose.model("guestuser", guestUserSchema);

module.exports = GuestUser;
