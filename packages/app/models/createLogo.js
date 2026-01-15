const mongoose = require("mongoose");
const { StatusTypes } = require("../utils/constants");
const { URL_REGEX, URL_ERROR_MESSAGE } = require("../utils/validator");

const createLogoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  companyUrl: {
    type: String,
    required: true,
    trim: true,
    match: [URL_REGEX, URL_ERROR_MESSAGE],
  },
  images: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "images",
  },
  status: {
    type: String,
    enum: Object.values(StatusTypes),
    default: StatusTypes.PENDING,
  },
  operator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  comment: {
    type: String,
    trim: true,
  },
  openedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
    default: null,
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const CreateLogo = mongoose.model("createLogo", createLogoSchema);

module.exports = CreateLogo;
