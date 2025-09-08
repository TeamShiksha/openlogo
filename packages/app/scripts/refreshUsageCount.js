const mongoose = require("mongoose");

const Subscriptions = require("../models/subscriptions");

async function refreshUsageCount() {
  try {
    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;
    if (!isFirstDayOfMonth) {
      console.log("Not the first day of the month, skipping...");
      return;
    }
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not provided");
    }
    await mongoose.connect(process.env.MONGO_URL);
    await Subscriptions.updateMany(
      { is_active: true },
      {
        usage_count: 0,
        updated_at: new Date(),
      }
    ).then(() => {
      console.log("Usage count refreshed successfully");
    });
  } catch (error) {
    console.error("Error refreshing usage count:", error);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      mongoose.connection.close();
    }
  }
}

if (require.main === module) {
  refreshUsageCount()
    .then(() => {
      process.exit(0);
    })
    .catch(() => {
      process.exit(1);
    });
}

module.exports = refreshUsageCount;
