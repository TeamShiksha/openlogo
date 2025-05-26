const mongoose = require("mongoose");
const { StatusTypes } = require("../utils/constants");

const raiseRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  companyUrl: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/.*)?$/,
      "Please enter a valid URL.",
    ],
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
    default: Date.now, // automatically set when created
  },
  closedAt: {
    type: Date,
    default: null, // will be set once status is RESOLVED
  },
  updated_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const RaiseRequest = mongoose.model("RaiseRequest", raiseRequestSchema);

module.exports = RaiseRequest;
