const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
/**
 * API Requests Model: Lightweight records for tracking logo API requests over time.
 * Kept minimal to enable time-series graphs (createdAt) and basic aggregation.
 */
const apiRequestSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    subscription_id: {
      type: Schema.Types.ObjectId,
      ref: "subscriptions",
    },
    image_id: {
      type: Schema.Types.ObjectId,
      ref: "images",
      required: true,
    },
    response_size_bytes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index to make descending sort faster.
apiRequestSchema.index({ createdAt: -1 });
apiRequestSchema.index({ user_id: 1 });

const ApiRequest = model("api_request", apiRequestSchema, "api_requests");
module.exports = ApiRequest;
