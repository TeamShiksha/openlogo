/**
 * seedHistoricalReleases.js
 *
 * One-time seed script to insert/upsert historical releases into MongoDB.
 * Source data: historicalReleasesData.js
 *
 * Required environment variable:
 *   MONGO_URL - MongoDB connection string
 *
 * Exit codes:
 *   0 - Success
 *   1 - Fatal error (DB connection error, missing env vars, validation failure)
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const Release = require("../../models/release");
const historicalReleases = require("./historicalReleasesData");

function log(msg) {
  console.log(`[seed-historical-releases] ${msg}`);
}

function error(msg) {
  console.error(`[seed-historical-releases][ERROR] ${msg}`);
}

async function seedHistoricalReleases() {
  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    throw new Error("Missing required environment variable: MONGO_URL");
  }

  log("Connecting to MongoDB...");
  await mongoose.connect(mongoUrl);
  log("Connected to MongoDB.");

  try {
    log(`Seeding ${historicalReleases.length} historical releases...`);

    for (const release of historicalReleases) {
      if (!release.version || !release.tagName) {
        throw new Error(
          `Invalid historical release document: missing version or tagName in ${JSON.stringify(release)}`
        );
      }

      const saved = await Release.findOneAndUpdate(
        { version: release.version },
        { $set: release },
        { upsert: true, new: true, runValidators: true }
      );

      log(
        `Successfully seeded release version="${saved.version}" tagName="${saved.tagName}" (MongoDB _id: ${saved._id}).`
      );
    }

    log("Historical release seeding completed successfully.");
  } finally {
    if (process.env.NODE_ENV !== "test") {
      await mongoose.connection.close();
      log("MongoDB connection closed.");
    }
  }
}

if (require.main === module) {
  seedHistoricalReleases()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      error(`Seeding failed: ${err.message}`);
      if (err.stack) console.error(err.stack);
      process.exit(1);
    });
}

module.exports = { seedHistoricalReleases };
