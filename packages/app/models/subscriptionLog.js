const mongoose = require("mongoose");

const subscriptionLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    changed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

subscriptionLogSchema.index({ user_id: 1 });
subscriptionLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("subscription_logs", subscriptionLogSchema);
