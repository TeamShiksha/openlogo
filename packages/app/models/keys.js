const bcrypt = require("bcryptjs");
const { v4 } = require("uuid");
const mongoose = require("mongoose");
const { KeyTypes } = require("../utils/constants");

/**
 * Keys Model: Represents API keys associated with user accounts.
 * This model manages the creation, storage, and validation of API keys.
 * It efficient manages and retrieves API key-related information in the application.
 */
const keySchema = new mongoose.Schema({
  api_key: {
    type: String,
    required: false,
    default: function () {
      return this.key_type === KeyTypes.PUBLISHABLE
        ? undefined
        : v4().replaceAll("-", "").toUpperCase();
    },
  },
  publishable_key: {
    type: String,
    unique: true,
    sparse: true,
    index: true,
    default: function () {
      return this.key_type === KeyTypes.PUBLISHABLE
        ? `pk_${v4().replaceAll("-", "")}`
        : undefined;
    },
  },
  key_type: {
    type: String,
    enum: Object.values(KeyTypes),
    default: KeyTypes.SECRET,
    index: true,
  },
  allowed_origins: {
    type: [String],
    default: [],
  },
  is_origin_restricted: {
    type: Boolean,
    default: false,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  key_description: {
    type: String,
    required: true,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptions",
  },
  expires_at: {
    type: Date,
    required: true,
  },
});

keySchema.methods.matchKey = async function (key) {
  if (!this.api_key) return false;
  return await bcrypt.compare(key, this.api_key);
};

keySchema.pre("save", async function (next) {
  if (this.isModified("api_key") && this.api_key) {
    this.api_key = await bcrypt.hash(this.api_key, 10);
  }
  next();
});

keySchema.methods.data = function () {
  return {
    _id: this._id,
    key_description: this.key_description,
    subscription_id: this.subscription_id,
    expires_at: this.expires_at,
    created_at: this._id.getTimestamp(),
    updated_at: this.updated_at,
    key_type: this.key_type,
    publishable_key: this.publishable_key,
    allowed_origins: this.allowed_origins,
    is_origin_restricted: this.is_origin_restricted,
    is_active: this.is_active,
  };
};

const Keys = mongoose.model("keys", keySchema);

module.exports = Keys;
