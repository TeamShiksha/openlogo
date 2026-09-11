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
 *   1 - Fatal error (DB failure, GitHub API failure, missing env vars, validation failure)
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
 * Throws on non-2xx responses.
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

// ---------------------------------------------------------------------------
// Release note parser
// ---------------------------------------------------------------------------

const CATEGORY_MAP = {
  features: "Feature",
  enhancements: "Enhancement",
  "bug fixes": "Bug Fix",
  security: "Security",
  others: "Other",
};

/**
 * Parse release body into structured category sections and entries.
 * Returns { entries: Array, errors: Array }
 */
function parseReleaseBody(body) {
  const entries = [];
  const errors = [];

  if (!body || typeof body !== "string") {
    return { entries, errors };
  }

  // Remove HTML comments (like template guidance)
  const cleanBody = body.replace(/<!--[\s\S]*?-->/g, "");

  // Find all H2 headers: ## Header
  const h2Regex = /^##\s+(.+)$/gm;
  let match;
  const sectionIndices = [];
  while ((match = h2Regex.exec(cleanBody)) !== null) {
    sectionIndices.push({
      header: match[1].trim(),
      index: match.index,
      headerLength: match[0].length,
    });
  }

  for (let i = 0; i < sectionIndices.length; i++) {
    const sectionHeader = sectionIndices[i].header;
    const categoryKey = sectionHeader.toLowerCase();
    const category = CATEGORY_MAP[categoryKey];

    // Ignore unsupported sections such as ## Hero Image
    if (!category) continue;

    const start = sectionIndices[i].index + sectionIndices[i].headerLength;
    const end =
      i + 1 < sectionIndices.length
        ? sectionIndices[i + 1].index
        : cleanBody.length;
    const sectionContent = cleanBody.substring(start, end).trim();

    if (!sectionContent) continue;

    // Find all H3 headers inside this section
    const h3Regex = /^###\s+(.+)$/gm;
    let h3Match;
    const h3Indices = [];
    while ((h3Match = h3Regex.exec(sectionContent)) !== null) {
      h3Indices.push({
        headerLine: h3Match[1].trim(),
        fullHeader: h3Match[0],
        index: h3Match.index,
        headerLength: h3Match[0].length,
      });
    }

    if (h3Indices.length === 0) {
      if (sectionContent.length > 0) {
        errors.push({
          section: category,
          pr: null,
          title: null,
          message: `Malformed entry in section "${sectionHeader}". Expected heading starting with "### #<PR_NUMBER> | <TITLE>".`,
        });
      }
      continue;
    }

    const textBeforeH3 = sectionContent.substring(0, h3Indices[0].index).trim();
    if (textBeforeH3.length > 0) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Malformed content before entry in section "${sectionHeader}": "${textBeforeH3.substring(0, 40)}..."`,
      });
    }

    for (let j = 0; j < h3Indices.length; j++) {
      const h3Header = h3Indices[j].headerLine;
      const blockStart = h3Indices[j].index + h3Indices[j].headerLength;
      const blockEnd =
        j + 1 < h3Indices.length
          ? h3Indices[j + 1].index
          : sectionContent.length;
      const blockBody = sectionContent.substring(blockStart, blockEnd).trim();

      // Validate header format: #<PR_NUMBER> | <TITLE>
      const headerMatch = h3Header.match(/^#([^\s|]*)\s*\|\s*(.*)$/);
      let prNumber = null;
      let title = null;

      if (!headerMatch) {
        errors.push({
          section: category,
          pr: null,
          title: h3Header,
          message: `Invalid entry heading "### ${h3Header}". Expected format "### #<PR_NUMBER> | <TITLE>".`,
        });
      } else {
        const prRaw = headerMatch[1].trim();
        title = headerMatch[2].trim();

        if (
          !prRaw ||
          isNaN(prRaw) ||
          parseInt(prRaw, 10) <= 0 ||
          !/^\d+$/.test(prRaw)
        ) {
          errors.push({
            section: category,
            pr: prRaw || null,
            title: title || null,
            message: `Invalid PR number "${prRaw}" in entry heading "### ${h3Header}". PR number must be a positive integer.`,
          });
        } else {
          prNumber = parseInt(prRaw, 10);
        }

        if (!title) {
          errors.push({
            section: category,
            pr: prNumber,
            title: null,
            message: `Missing or empty title in entry heading "### ${h3Header}".`,
          });
        }
      }

      // Extract Contributors
      const contribMatch = blockBody.match(/^\*\*Contributors:\*\*\s*(.*)$/im);
      let contributors = [];

      if (!contribMatch) {
        errors.push({
          section: category,
          pr: prNumber,
          title: title,
          message: `Missing required Contributors field.`,
        });
      } else {
        const contribLine = contribMatch[1].trim();
        if (!contribLine) {
          errors.push({
            section: category,
            pr: prNumber,
            title: title,
            message: `Empty Contributors field.`,
          });
        } else {
          const tokens = contribLine.split(/\s+/).filter(Boolean);
          const validContributors = [];

          for (const token of tokens) {
            if (!token.startsWith("@")) {
              errors.push({
                section: category,
                pr: prNumber,
                title: title,
                message: `Invalid contributor "${token}". All contributor values must use GitHub username syntax beginning with "@".`,
              });
            } else {
              const username = token.slice(1).trim();
              if (!username) {
                errors.push({
                  section: category,
                  pr: prNumber,
                  title: title,
                  message: `Invalid contributor username "${token}".`,
                });
              } else {
                validContributors.push({ username });
              }
            }
          }

          if (validContributors.length > 0) {
            contributors = validContributors;
          }
        }
      }

      // Extract description
      let description = "";
      if (contribMatch) {
        const contribIdx = blockBody.indexOf(contribMatch[0]);
        description = blockBody.substring(0, contribIdx).trim();
      } else {
        description = blockBody.trim();
      }

      entries.push({
        category,
        prNumber,
        title,
        description,
        contributors,
      });
    }
  }

  return { entries, errors };
}

// ---------------------------------------------------------------------------
// GitHub Entity Validation (PR existence & User existence)
// ---------------------------------------------------------------------------

async function validateGitHubEntities(entries, owner, repo, token, cache = {}) {
  const errors = [];
  const prCache = cache.prCache || new Map();
  const userCache = cache.userCache || new Map();

  // Validate PR numbers
  for (const entry of entries) {
    const { category, prNumber, title } = entry;
    if (!prNumber) continue;

    if (!prCache.has(prNumber)) {
      try {
        await githubFetch(`/repos/${owner}/${repo}/pulls/${prNumber}`, token);
        prCache.set(prNumber, true);
      } catch {
        prCache.set(prNumber, false);
      }
    }

    if (!prCache.get(prNumber)) {
      errors.push({
        section: category,
        pr: prNumber,
        title: title,
        message: `PR #${prNumber} could not be found or fetched from repository "${owner}/${repo}".`,
      });
    }
  }

  // Validate Contributor Usernames
  for (const entry of entries) {
    const { category, prNumber, title, contributors } = entry;
    if (!contributors) continue;

    for (const c of contributors) {
      const { username } = c;
      if (!username) continue;

      if (!userCache.has(username)) {
        try {
          await githubFetch(`/users/${encodeURIComponent(username)}`, token);
          userCache.set(username, true);
        } catch {
          userCache.set(username, false);
        }
      }

      if (!userCache.get(username)) {
        errors.push({
          section: category,
          pr: prNumber,
          title: title,
          message: `Invalid contributor "@${username}". GitHub user could not be found.`,
        });
      }
    }
  }

  return errors;
}

function formatValidationErrors(errors) {
  let output = "Release validation failed:\n";
  errors.forEach((err, idx) => {
    const header = err.section
      ? `${err.section} → ${err.pr ? `PR #${err.pr}` : err.title ? `Entry "${err.title}"` : "Entry"}`
      : "Entry";
    output += `\n${idx + 1}. ${header}\n   ${err.message}\n`;
  });
  return output;
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

    // 3. Parse release entries and structure
    const { entries: parsedEntries, errors: parseErrors } =
      parseReleaseBody(body);

    // 4. Validate GitHub entities (PRs and users)
    const githubErrors = await validateGitHubEntities(
      parsedEntries,
      owner,
      repo,
      GITHUB_TOKEN
    );

    const allErrors = [...parseErrors, ...githubErrors];

    if (allErrors.length > 0) {
      const formattedErr = formatValidationErrors(allErrors);
      error(formattedErr);
      throw new Error("Release validation failed.");
    }

    log(`Validated ${parsedEntries.length} release entries successfully.`);

    // 5. Build release payload
    const releasePayload = {
      releaseDate: new Date(ghRelease.published_at),
      githubReleaseId: ghRelease.id,
      githubReleaseUrl: ghRelease.html_url,
      entries: parsedEntries,
    };

    // 6. Atomic upsert into MongoDB
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

module.exports = {
  syncRelease,
  parseReleaseBody,
  validateGitHubEntities,
  formatValidationErrors,
  CATEGORY_MAP,
};
