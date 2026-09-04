/**
 * syncReleases.js
 *
 * Synchronises a single GitHub Release into MongoDB.
 * Triggered by the GitHub Action `.github/workflows/sync-releases.yaml`
 * on release `published` and `edited` events.
 *
 * Required environment variables:
 *   GITHUB_TOKEN      - GitHub token (auto-provided by Actions)
 *   MONGO_URL         - MongoDB connection string
 *   RELEASE_TAG       - Tag name of the release to sync (e.g. "v1.2.0")
 *   GITHUB_REPOSITORY - "owner/repo" slug (auto-provided by Actions)
 *
 * For local testing, set GITHUB_REPO as a fallback for GITHUB_REPOSITORY.
 *
 * Exit codes:
 *   0 - Success
 *   1 - Fatal error (DB failure, GitHub API failure, missing env vars)
 */

"use strict";

const mongoose = require("mongoose");
const Release = require("../models/release");

// ---------------------------------------------------------------------------
// Logging helpers — prefixed for easy scanning in GitHub Actions log output
// ---------------------------------------------------------------------------

function log(msg) {
  console.log(`[sync-releases] ${msg}`);
}

function warn(msg) {
  console.warn(`[sync-releases][WARN] ${msg}`);
}

function error(msg) {
  console.error(`[sync-releases][ERROR] ${msg}`);
}

// ---------------------------------------------------------------------------
// Environment / configuration
// ---------------------------------------------------------------------------

function getConfig() {
  const { GITHUB_TOKEN, MONGO_URL, RELEASE_TAG } = process.env;
  const repository =
    process.env.GITHUB_REPOSITORY || process.env.GITHUB_REPO || null;

  const missing = [];
  if (!GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  if (!MONGO_URL) missing.push("MONGO_URL");
  if (!RELEASE_TAG) missing.push("RELEASE_TAG");
  if (!repository) missing.push("GITHUB_REPOSITORY (or GITHUB_REPO)");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  const [owner, repo] = repository.split("/");
  if (!owner || !repo) {
    throw new Error(
      `GITHUB_REPOSITORY must be in "owner/repo" format, got: "${repository}"`
    );
  }

  return { GITHUB_TOKEN, MONGO_URL, RELEASE_TAG, owner, repo };
}

// ---------------------------------------------------------------------------
// GitHub API helpers
// ---------------------------------------------------------------------------

/**
 * Wraps fetch with GitHub API defaults and error handling.
 * Throws on non-2xx responses — callers decide whether to abort or continue.
 */
async function githubFetch(path, token) {
  const url = `https://api.github.com${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "openlogo-sync-releases",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`GitHub API ${url} returned ${res.status}: ${body}`);
  }

  return await res.json();
}

/**
 * Fetch a release by tag from the GitHub Releases API.
 */
async function fetchRelease(owner, repo, tag, token) {
  log(`Fetching release tag="${tag}" from GitHub...`);
  return await githubFetch(
    `/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`,
    token
  );
}

/**
 * Fetch a single pull request.
 * Returns null (and logs a warning) instead of throwing if the PR is not found
 * or if the API call fails — the caller will keep the entry without contributor data.
 */
async function fetchPullRequest(owner, repo, prNumber, token) {
  try {
    return await githubFetch(
      `/repos/${owner}/${repo}/pulls/${prNumber}`,
      token
    );
  } catch (err) {
    warn(`Could not fetch PR #${prNumber}: ${err.message}`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Release note parser
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  features: "Feature",
  enhancements: "Enhancement",
  "bug fixes": "Bug Fix",
  security: "Security",
};

/**
 * Parse release body into structured category sections and entries.
 *
 * Returns an array of raw entry objects:
 *   { category, prNumber, title, description }
 *
 * Invalid / malformed entries are skipped with a warning.
 */
function parseReleaseBody(body) {
  const entries = [];

  // Split on H2 headings (## Section Name)
  // Each segment: [ fullMatch, headingText, sectionContent ]
  const sectionRegex = /##\s+(.+?)\s*\n([\s\S]*?)(?=\n##\s|\s*$)/gi;
  let sectionMatch;

  while ((sectionMatch = sectionRegex.exec(body)) !== null) {
    const headingRaw = sectionMatch[1].trim().toLowerCase();
    const sectionContent = sectionMatch[2];

    const category = CATEGORY_MAP[headingRaw];
    if (!category) continue; // Skip Hero Image and any unknown sections

    // Split section on H3 headings (### #NNNN | Title)
    const entryRegex =
      /###\s+#(\d+)\s*\|\s*(.+?)\s*\n([\s\S]*?)(?=\n###\s|\s*$)/gi;
    let entryMatch;

    while ((entryMatch = entryRegex.exec(sectionContent)) !== null) {
      const prNumberRaw = entryMatch[1];
      const title = entryMatch[2].trim();
      const description = entryMatch[3].trim();

      const prNumber = parseInt(prNumberRaw, 10);
      if (isNaN(prNumber) || prNumber <= 0) {
        warn(
          `Skipping entry with invalid PR number "#${prNumberRaw}" in section "${category}".`
        );
        continue;
      }

      if (!title) {
        warn(`Skipping PR #${prNumber} in section "${category}": empty title.`);
        continue;
      }

      entries.push({ category, prNumber, title, description });
    }
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Contributor enrichment
// ---------------------------------------------------------------------------

/**
 * Fetch PR data and extract contributor metadata.
 * Returns a contributor object — all fields are null on failure.
 */
async function enrichEntryWithPR(entry, owner, repo, token) {
  const pr = await fetchPullRequest(owner, repo, entry.prNumber, token);

  if (!pr) {
    return {
      ...entry,
      contributor: { username: null },
    };
  }

  const user = pr.user || {};
  return {
    ...entry,
    contributor: {
      username: user.login || null,
    },
  };
}

// ---------------------------------------------------------------------------
// Main sync function
// ---------------------------------------------------------------------------

async function syncRelease() {
  const config = getConfig();
  const { GITHUB_TOKEN, MONGO_URL, RELEASE_TAG, owner, repo } = config;

  // 1. Connect to MongoDB
  log("Connecting to MongoDB...");
  await mongoose.connect(MONGO_URL);
  log("Connected to MongoDB.");

  try {
    // 2. Fetch release from GitHub
    const ghRelease = await fetchRelease(
      owner,
      repo,
      RELEASE_TAG,
      GITHUB_TOKEN
    );

    log(
      `Fetched release: id=${ghRelease.id}, tag=${ghRelease.tag_name}, published=${ghRelease.published_at}`
    );

    const body = ghRelease.body || "";

    // 4. Parse release entries
    const rawEntries = parseReleaseBody(body);
    log(`Parsed ${rawEntries.length} release entries.`);

    // 5. Enrich entries with PR metadata (in parallel, failures are non-fatal)
    const enrichedEntries = await Promise.all(
      rawEntries.map((entry) =>
        enrichEntryWithPR(entry, owner, repo, GITHUB_TOKEN)
      )
    );

    log(
      `Enriched ${enrichedEntries.length} entries (some contributor fields may be null if PR fetch failed).`
    );

    // 6. Build the release document payload
    const releasePayload = {
      releaseDate: new Date(ghRelease.published_at),
      githubReleaseId: ghRelease.id,
      githubReleaseUrl: ghRelease.html_url,
      entries: enrichedEntries,
    };

    // 7. Atomic upsert — single write, no partial persistence risk
    log(`Upserting release version="${RELEASE_TAG}" into MongoDB...`);
    const saved = await Release.findOneAndUpdate(
      { version: RELEASE_TAG },
      { $set: { version: RELEASE_TAG, ...releasePayload } },
      { upsert: true, new: true, runValidators: true }
    );

    log(
      `Successfully synced release "${RELEASE_TAG}" (MongoDB _id: ${saved._id}).`
    );
  } finally {
    // Always close the connection
    await mongoose.connection.close();
    log("MongoDB connection closed.");
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

if (require.main === module) {
  syncRelease()
    .then(() => {
      log("Sync completed successfully.");
      process.exit(0);
    })
    .catch((err) => {
      error(`Sync failed: ${err.message}`);
      if (err.stack) console.error(err.stack);
      process.exit(1);
    });
}

module.exports = { syncRelease, parseReleaseBody };
