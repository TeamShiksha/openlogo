"use strict";

const mongoose = require("mongoose");
const Release = require("../../models/release");
const {
  seedHistoricalReleases,
} = require("../../scripts/releases/seedHistoricalReleases");
const historicalReleases = require("../../scripts/releases/historicalReleasesData");

describe("seedHistoricalReleases Script", () => {
  let mongoUri;

  beforeAll(async () => {
    mongoUri = process.env.MONGO_URL;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  afterAll(async () => {
    await Release.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await Release.deleteMany({});
  });

  it("seeds historical releases into MongoDB idempotently", async () => {
    process.env.MONGO_URL = mongoUri;

    await seedHistoricalReleases();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    const count = await Release.countDocuments({});
    expect(count).toBe(historicalReleases.length);

    // Verify first historical release doc
    const firstDoc = await Release.findOne({
      version: historicalReleases[0].version,
    });
    expect(firstDoc).not.toBeNull();
    expect(firstDoc.tagName).toBe(historicalReleases[0].tagName);

    // Run again to test idempotency
    await seedHistoricalReleases();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }

    const countAfterReseed = await Release.countDocuments({});
    expect(countAfterReseed).toBe(historicalReleases.length);
  });
});
