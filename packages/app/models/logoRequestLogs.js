const Schema = require("mongoose").Schema;
const model = require("mongoose").model;
/**
 * Logo Request Logs Model: Lightweight records for tracking logo requests over time.
 * Kept minimal to enable time-series graphs (createdAt) and basic aggregation.
 */
const logoRequestLogsSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    key_id: {
      type: Schema.Types.ObjectId,
      ref: "keys",
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
logoRequestLogsSchema.index({ createdAt: -1 });
logoRequestLogsSchema.index({ user_id: 1 });

const LogoRequestLogs = model(
  "logo_request_log",
  logoRequestLogsSchema,
  "logo_request_logs"
);
module.exports = LogoRequestLogs;
