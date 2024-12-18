const bcrypt = require("bcrypt");
const { v4 } = require("uuid");
const mongoose = require("mongoose");

/**
 * Keys Model: Represents API keys associated with user accounts.
 * This model manages the creation, storage, and validation of API keys.
 * It efficient manages and retrieves API key-related information in the application.
*/
const keySchema = new mongoose.Schema({
  api_key: { 
    type: String,
    required: true,
    default: () => v4().replaceAll("-", "").toUpperCase()
  },
  key_description: {
    type: String,
    required: true
  },
  updated_at: { 
    type: Date,
    default: Date.now 
  },
  subscription_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptions",
  }
});

keySchema.methods.matchKey = async function(key) {
  return await bcrypt.compare(key, this.api_key);
};

keySchema.pre("save", async function(next) {
  if (this.isModified("api_key")) {
    this.api_key = await bcrypt.hash(this.api_key, 10);
  }
  next();
});

keySchema.methods.data = function() {
  return {
    _id: this._id,
    key_description: this.key_description,
    api_key: this.api_key,
    subscription_id: this.subscription_id,
    created_at: this._id.getTimestamp(),
    updated_at: this.updated_at,
  };
};

const Keys = mongoose.model("keys", keySchema);

module.exports = Keys;
