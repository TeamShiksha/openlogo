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
const Release = require("../../models/release");

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

  // Find all H3 headers: ### Header
  const h3Regex = /^###\s+(.+)$/gm;
  let match;
  const sectionIndices = [];
  while ((match = h3Regex.exec(cleanBody)) !== null) {
    sectionIndices.push({
      header: match[1].trim(),
      index: match.index,
      headerLength: match[0].length,
    });
  }

  for (let i = 0; i < sectionIndices.length; i++) {
    const sectionHeader = sectionIndices[i].header;
    // Strip leading emojis and symbols (non-alphanumeric/non-space prefix)
    const cleanHeaderName = sectionHeader
      .replace(/^[\p{Extended_Pictographic}\s\W]+/u, "")
      .trim();
    const categoryKey = (cleanHeaderName || sectionHeader).toLowerCase();
    const category = CATEGORY_MAP[categoryKey];

    // Ignore unsupported sections
    if (!category) continue;

    const start = sectionIndices[i].index + sectionIndices[i].headerLength;
    const end =
      i + 1 < sectionIndices.length
        ? sectionIndices[i + 1].index
        : cleanBody.length;
    const sectionContent = cleanBody.substring(start, end).trim();

    // Check for empty categories or leftover "Entry" placeholder
    if (!sectionContent) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Empty section for category "${sectionHeader}". Unused categories must be removed.`,
      });
      continue;
    }

    if (/^Entry$/i.test(sectionContent)) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Leftover placeholder "Entry" found in section "${sectionHeader}". Unused categories must be removed.`,
      });
      continue;
    }

    // Find all H4 headers inside this section
    const h4Regex = /^####\s+(.+)$/gm;
    let h4Match;
    const h4Indices = [];
    while ((h4Match = h4Regex.exec(sectionContent)) !== null) {
      h4Indices.push({
        headerLine: h4Match[1].trim(),
        fullHeader: h4Match[0],
        index: h4Match.index,
        headerLength: h4Match[0].length,
      });
    }

    if (h4Indices.length === 0) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Malformed or empty entry in section "${sectionHeader}". Expected heading starting with "#### #<PR_NUMBER> | <TITLE>".`,
      });
      continue;
    }

    const textBeforeH4 = sectionContent.substring(0, h4Indices[0].index).trim();
    if (textBeforeH4.length > 0) {
      if (/^Entry$/i.test(textBeforeH4)) {
        errors.push({
          section: category,
          pr: null,
          title: null,
          message: `Leftover placeholder "Entry" found before entry in section "${sectionHeader}".`,
        });
      } else {
        errors.push({
          section: category,
          pr: null,
          title: null,
          message: `Malformed content before entry in section "${sectionHeader}": "${textBeforeH4.substring(0, 40)}..."`,
        });
      }
    }

    for (let j = 0; j < h4Indices.length; j++) {
      const h4Header = h4Indices[j].headerLine;
      const blockStart = h4Indices[j].index + h4Indices[j].headerLength;
      const blockEnd =
        j + 1 < h4Indices.length
          ? h4Indices[j + 1].index
          : sectionContent.length;
      const blockBody = sectionContent.substring(blockStart, blockEnd).trim();

      // Validate header format: #<PR_NUMBER> | <TITLE>
      const headerMatch = h4Header.match(/^#([^\s|]*)\s*\|\s*(.*)$/);
      let prNumber = null;
      let title = null;

      if (!headerMatch) {
        errors.push({
          section: category,
          pr: null,
          title: h4Header,
          message: `Invalid entry heading "#### ${h4Header}". Expected format "#### #<PR_NUMBER> | <TITLE>".`,
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
            message: `Invalid PR number "${prRaw}" in entry heading "#### ${h4Header}". PR number must be a positive integer.`,
          });
        } else {
          prNumber = parseInt(prRaw, 10);
        }

        if (!title) {
          errors.push({
            section: category,
            pr: prNumber,
            title: null,
            message: `Missing or empty title in entry heading "#### ${h4Header}".`,
          });
        }
      }

      // Extract Contributors (format: > Contributors: @user1 @user2 or **Contributors:** @user1 @user2)
      const contribMatch = blockBody.match(
        /^(?:>\s*)?(?:\*\*)?Contributors:(?:\*\*)?\s*(.*)$/im
      );
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
      `Fetched release: id=${ghRelease.id}, tag=${ghRelease.tag_name}, name=${ghRelease.name}, published=${ghRelease.published_at}`
    );

    const tagName = (ghRelease.tag_name || RELEASE_TAG || "").trim();
    const version = (ghRelease.name || RELEASE_TAG || "").trim();

    if (!version || !tagName) {
      throw new Error(
        `Invalid release payload: version="${version}", tagName="${tagName}". Both version and tagName are required.`
      );
    }

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
      version,
      tagName,
      releaseDate: new Date(ghRelease.published_at),
      githubReleaseId: ghRelease.id,
      githubReleaseUrl: ghRelease.html_url,
      entries: parsedEntries,
    };

    // 6. Atomic upsert into MongoDB using { version }
    log(
      `Upserting release version="${version}" (tagName="${tagName}") into MongoDB...`
    );
    const saved = await Release.findOneAndUpdate(
      { version },
      { $set: releasePayload },
      { upsert: true, new: true, runValidators: true }
    );

    log(
      `Successfully synced release "${version}" (tagName="${tagName}") (MongoDB _id: ${saved._id}).`
    );
  } finally {
    if (process.env.NODE_ENV !== "test") {
      await mongoose.connection.close();
      log("MongoDB connection closed.");
    }
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
