const mongoose = require("mongoose");

/**
 * Release Model: Stores GitHub Release data synced via the release sync script.
 *
 * One document per release, uniquely identified by the version/tag string.
 * GitHub Releases are the single source of truth — this collection is
 * populated and kept up-to-date by scripts/syncReleases.js.
 */

const contributorSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const releaseEntrySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Feature", "Enhancement", "Bug Fix", "Security", "Other"],
      required: true,
    },

    prNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    contributors: {
      type: [contributorSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length > 0,
        message: "At least one contributor is required",
      },
    },
  },
  { _id: false }
);

const releaseSchema = new mongoose.Schema(
  {
    version: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    githubReleaseId: {
      type: Number,
      required: true,
    },
    githubReleaseUrl: {
      type: String,
      required: true,
    },
    entries: {
      type: [releaseEntrySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Fast reverse-chronological listing for GET /api/releases
releaseSchema.index({ releaseDate: -1 });

const Release = mongoose.model("releases", releaseSchema);

module.exports = Release;
