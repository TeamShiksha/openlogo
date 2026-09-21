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
// Logging helpers
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

  const repositoryParts = repository.split("/");

  if (repositoryParts.length !== 2) {
    throw new Error(
      `GITHUB_REPOSITORY must be in "owner/repo" format, got: "${repository}"`
    );
  }

  const [owner, repo] = repositoryParts;

  if (!owner || !repo) {
    throw new Error(
      `GITHUB_REPOSITORY must be in "owner/repo" format, got: "${repository}"`
    );
  }

  return {
    GITHUB_TOKEN,
    MONGO_URL,
    RELEASE_TAG,
    owner,
    repo,
  };
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

const CATEGORY_NAMES = Object.keys(CATEGORY_MAP);

/**
 * Removes HTML comments from release notes.
 *
 * The release template contains instructions/examples inside an HTML comment.
 * Those examples must not be parsed as real release content.
 */
function removeHtmlComments(body) {
  return body.replace(/<!--[\s\S]*?-->/g, "");
}

/**
 * Normalises a category heading.
 *
 * The release template requires:
 *
 *   ### 📝 Features
 *
 * The emoji is optional for validation, but the category name must match
 * exactly.
 */
function getCategoryFromHeading(header) {
  const categoryName = header
    .trim()
    .replace(/^📝\s*/u, "")
    .trim()
    .toLowerCase();

  return CATEGORY_MAP[categoryName] || null;
}

/**
 * Checks whether a heading is an exact supported category heading.
 */
function isSupportedCategoryHeading(header) {
  const normalized = header
    .trim()
    .replace(/^📝\s*/u, "")
    .trim()
    .toLowerCase();

  return CATEGORY_NAMES.includes(normalized);
}

/**
 * Parse all Markdown ATX headings outside fenced code blocks.
 */
function getMarkdownHeadings(body) {
  const headings = [];
  const lines = body.split(/\r?\n/);

  let insideCodeFence = false;
  let fenceCharacter = null;

  let offset = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    const fenceMatch = trimmed.match(/^(```+|~~~+)/);

    if (fenceMatch) {
      const currentFence = fenceMatch[1][0];

      if (!insideCodeFence) {
        insideCodeFence = true;
        fenceCharacter = currentFence;
      } else if (fenceCharacter === currentFence) {
        insideCodeFence = false;
        fenceCharacter = null;
      }

      offset += line.length + 1;
      continue;
    }

    if (!insideCodeFence) {
      const headingMatch = line.match(/^(#{1,6})[ \t]+(.+?)\s*$/);

      if (headingMatch) {
        headings.push({
          level: headingMatch[1].length,
          text: headingMatch[2].trim(),
          index: offset,
          line,
        });
      }
    }

    offset += line.length + 1;
  }

  return headings;
}

/**
 * Parse release body into structured category sections and entries.
 *
 * Returns:
 * {
 *   entries: Array,
 *   errors: Array
 * }
 */
function parseReleaseBody(body) {
  const entries = [];
  const errors = [];

  if (!body || typeof body !== "string" || !body.trim()) {
    errors.push({
      section: null,
      pr: null,
      title: null,
      message:
        "Release contains zero parsed entries. At least one valid release entry is required.",
    });

    return { entries, errors };
  }

  // Remove template instructions and examples.
  const cleanBody = removeHtmlComments(body);

  // Get Markdown headings while respecting fenced code blocks.
  const headings = getMarkdownHeadings(cleanBody);

  // -------------------------------------------------------------------------
  // Validate heading structure
  // -------------------------------------------------------------------------

  for (const heading of headings) {
    /*
     * H3 headings represent release categories.
     * Any H3 that is not a supported category is invalid.
     */
    if (heading.level === 3) {
      if (!isSupportedCategoryHeading(heading.text)) {
        errors.push({
          section: null,
          pr: null,
          title: heading.text,
          message: `Unsupported category heading "### ${heading.text}". Expected one of: Features, Enhancements, Bug Fixes, Security, Others.`,
        });
      }

      continue;
    }

    /*
     * H1/H2/H5/H6 headings are never valid in the release structure.
     *
     * The optional release introduction is allowed, but it must not introduce
     * another Markdown heading.
     */
    if (
      heading.level === 1 ||
      heading.level === 2 ||
      heading.level === 5 ||
      heading.level === 6
    ) {
      errors.push({
        section: null,
        pr: null,
        title: heading.text,
        message: `Invalid heading level "H${heading.level}" for "${heading.text}". Release categories must use "###".`,
      });
    }
  }

  const categoryHeadings = headings.filter(
    (heading) => heading.level === 3 && isSupportedCategoryHeading(heading.text)
  );

  // -------------------------------------------------------------------------
  // Zero-entry validation
  // -------------------------------------------------------------------------

  if (categoryHeadings.length === 0) {
    errors.push({
      section: null,
      pr: null,
      title: null,
      message:
        "Release contains zero parsed entries. At least one valid release entry is required.",
    });

    return { entries, errors };
  }

  // -------------------------------------------------------------------------
  // Parse each supported category
  // -------------------------------------------------------------------------

  for (let i = 0; i < categoryHeadings.length; i++) {
    const categoryHeading = categoryHeadings[i];
    const category = getCategoryFromHeading(categoryHeading.text);

    const categoryStart =
      categoryHeading.index + categoryHeading.text.length + 4;

    /*
     * Find the next H3 heading.
     *
     * Unsupported H3 headings have already been reported as validation
     * errors, so they still act as section boundaries.
     */
    const nextH3 = headings.find(
      (heading) => heading.level === 3 && heading.index > categoryHeading.index
    );

    const categoryEnd = nextH3 ? nextH3.index : cleanBody.length;

    const sectionContent = cleanBody
      .substring(categoryStart, categoryEnd)
      .trim();

    if (!sectionContent) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Empty section for category "${categoryHeading.text}". Unused categories must be removed.`,
      });

      continue;
    }

    if (/^Entry$/i.test(sectionContent)) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Leftover placeholder "Entry" found in section "${categoryHeading.text}". Unused categories must be removed.`,
      });

      continue;
    }

    // -----------------------------------------------------------------------
    // Find H4 entries within this category
    // -----------------------------------------------------------------------

    const sectionHeadings = getMarkdownHeadings(sectionContent);

    const h4Headings = sectionHeadings.filter((heading) => heading.level === 4);

    /*
     * Any heading other than H4 inside a category is invalid.
     *
     * H3 is handled separately because it represents the next category.
     */
    for (const heading of sectionHeadings) {
      if (heading.level !== 4) {
        errors.push({
          section: category,
          pr: null,
          title: heading.text,
          message: `Invalid heading level "H${heading.level}" found inside "${categoryHeading.text}". Entries must use "####".`,
        });
      }
    }

    if (h4Headings.length === 0) {
      errors.push({
        section: category,
        pr: null,
        title: null,
        message: `Malformed or empty entry in section "${categoryHeading.text}". Expected heading starting with "#### #<PR_NUMBER> | <TITLE>".`,
      });

      continue;
    }

    // -----------------------------------------------------------------------
    // Validate content before first entry
    // -----------------------------------------------------------------------

    const firstEntryStart = h4Headings[0].index;
    const textBeforeH4 = sectionContent.substring(0, firstEntryStart).trim();

    if (textBeforeH4) {
      if (/^Entry$/i.test(textBeforeH4)) {
        errors.push({
          section: category,
          pr: null,
          title: null,
          message: `Leftover placeholder "Entry" found before entry in section "${categoryHeading.text}".`,
        });
      } else {
        errors.push({
          section: category,
          pr: null,
          title: null,
          message: `Malformed content before entry in section "${categoryHeading.text}": "${textBeforeH4.substring(
            0,
            80
          )}${textBeforeH4.length > 80 ? "..." : ""}"`,
        });
      }
    }

    // -----------------------------------------------------------------------
    // Parse individual entries
    // -----------------------------------------------------------------------

    for (let j = 0; j < h4Headings.length; j++) {
      const h4Heading = h4Headings[j];

      const blockStart = h4Heading.index + h4Heading.line.length;

      const blockEnd =
        j + 1 < h4Headings.length
          ? h4Headings[j + 1].index
          : sectionContent.length;

      const blockBody = sectionContent.substring(blockStart, blockEnd).trim();

      const h4Header = h4Heading.text;

      // ---------------------------------------------------------------
      // Validate H4 format: #<PR_NUMBER> | <TITLE>
      // ---------------------------------------------------------------

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

        if (!prRaw || !/^\d+$/.test(prRaw) || Number.parseInt(prRaw, 10) <= 0) {
          errors.push({
            section: category,
            pr: prRaw || null,
            title: title || null,
            message: `Invalid PR number "${prRaw}". PR number must be a positive integer.`,
          });
        } else {
          prNumber = Number.parseInt(prRaw, 10);
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

      // ---------------------------------------------------------------
      // Validate Contributors fields
      // ---------------------------------------------------------------

      const lines = blockBody.split(/\r?\n/);

      const contributorLineIndices = [];

      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];

        /*
         * Any line containing "Contributors:" is treated as an attempt
         * to define the Contributors field.
         *
         * This lets us detect duplicate/malformed Contributors fields.
         */
        if (/Contributors:/i.test(line)) {
          contributorLineIndices.push(lineIndex);
        }
      }

      if (contributorLineIndices.length === 0) {
        errors.push({
          section: category,
          pr: prNumber,
          title,
          message: "Missing required Contributors field.",
        });
      } else if (contributorLineIndices.length > 1) {
        errors.push({
          section: category,
          pr: prNumber,
          title,
          message:
            "Duplicate Contributors fields found. Each entry must contain exactly one Contributors field.",
        });
      }

      let contributors = [];
      let description = "";

      if (contributorLineIndices.length > 0) {
        const contributorLineIndex = contributorLineIndices[0];
        const contributorLine = lines[contributorLineIndex];

        /*
         * Enforce the exact required format:
         *
         * > Contributors: @username
         *
         * Multiple usernames are allowed:
         *
         * > Contributors: @user1 @user2
         */
        const contributorMatch = contributorLine.match(
          /^> Contributors: (.+)$/
        );

        if (!contributorMatch) {
          errors.push({
            section: category,
            pr: prNumber,
            title,
            message:
              'Invalid Contributors field. Expected exact format "> Contributors: @username".',
          });
        } else {
          const contributorValue = contributorMatch[1].trim();

          if (!contributorValue) {
            errors.push({
              section: category,
              pr: prNumber,
              title,
              message: "Empty Contributors field.",
            });
          } else {
            const tokens = contributorValue.split(/\s+/);
            const validContributors = [];

            for (const token of tokens) {
              if (!/^@[A-Za-z0-9-]+$/.test(token)) {
                errors.push({
                  section: category,
                  pr: prNumber,
                  title,
                  message: `Invalid contributor "${token}". Contributors must use GitHub username syntax beginning with "@".`,
                });

                continue;
              }

              validContributors.push({
                username: token.slice(1),
              });
            }

            contributors = validContributors;
          }
        }

        // -------------------------------------------------------------
        // Description
        // -------------------------------------------------------------

        const descriptionLines = lines
          .slice(0, contributorLineIndex)
          .join("\n")
          .trim();

        description = descriptionLines;

        if (!description) {
          errors.push({
            section: category,
            pr: prNumber,
            title,
            message: "Missing description.",
          });
        }

        // -------------------------------------------------------------
        // Content after Contributors
        // -------------------------------------------------------------

        const contentAfterContributor = lines
          .slice(contributorLineIndex + 1)
          .join("\n")
          .trim();

        if (contentAfterContributor) {
          errors.push({
            section: category,
            pr: prNumber,
            title,
            message:
              "Unexpected content found after the Contributors field. The Contributors field must be the last content in the entry.",
          });
        }
      } else {
        /*
         * No Contributors field exists.
         *
         * We still validate whether there is a description so that the
         * resulting error is meaningful.
         */
        description = blockBody;

        if (!description) {
          errors.push({
            section: category,
            pr: prNumber,
            title,
            message: "Missing description.",
          });
        }
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

  // -------------------------------------------------------------------------
  // Final validation
  // -------------------------------------------------------------------------

  if (entries.length === 0) {
    errors.push({
      section: null,
      pr: null,
      title: null,
      message:
        "Release contains zero parsed entries. At least one valid release entry is required.",
    });
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

  // -------------------------------------------------------------------------
  // Validate PR numbers
  // -------------------------------------------------------------------------

  for (const entry of entries) {
    const { category, prNumber, title } = entry;

    if (!prNumber) {
      continue;
    }

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
        title,
        message: `PR #${prNumber} could not be found or fetched from repository "${owner}/${repo}".`,
      });
    }
  }

  // -------------------------------------------------------------------------
  // Validate contributor usernames
  // -------------------------------------------------------------------------

  for (const entry of entries) {
    const { category, prNumber, title, contributors } = entry;

    if (!contributors || contributors.length === 0) {
      continue;
    }

    for (const contributor of contributors) {
      const { username } = contributor;

      if (!username) {
        continue;
      }

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
          title,
          message: `Invalid contributor "@${username}". GitHub user could not be found.`,
        });
      }
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Validation error formatting
// ---------------------------------------------------------------------------

function formatValidationErrors(errors) {
  let output = "Release validation failed:\n";

  errors.forEach((err, index) => {
    const header = err.section
      ? `${err.section} → ${
          err.pr
            ? `PR #${err.pr}`
            : err.title
              ? `Entry "${err.title}"`
              : "Entry"
        }`
      : err.title
        ? `Entry "${err.title}"`
        : "Release";

    output += `\n${index + 1}. ${header}\n`;
    output += `   ${err.message}\n`;
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

    // 3. Parse and validate release structure
    const { entries: parsedEntries, errors: parseErrors } =
      parseReleaseBody(body);

    // 4. Validate GitHub entities
    const githubErrors = await validateGitHubEntities(
      parsedEntries,
      owner,
      repo,
      GITHUB_TOKEN
    );

    const allErrors = [...parseErrors, ...githubErrors];

    // 5. Fail before touching MongoDB if validation fails
    if (allErrors.length > 0) {
      const formattedErrors = formatValidationErrors(allErrors);

      error(formattedErrors);

      throw new Error(
        "Release validation failed. See the validation errors above."
      );
    }

    log(`Validated ${parsedEntries.length} release entries successfully.`);

    // 6. Build release payload
    const releasePayload = {
      version,
      tagName,
      releaseDate: new Date(ghRelease.published_at),
      githubReleaseId: ghRelease.id,
      githubReleaseUrl: ghRelease.html_url,
      entries: parsedEntries,
    };

    // 7. Atomic upsert into MongoDB using { version }
    log(
      `Upserting release version="${version}" (tagName="${tagName}") into MongoDB...`
    );

    const saved = await Release.findOneAndUpdate(
      { version },
      { $set: releasePayload },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
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

      if (err.stack) {
        console.error(err.stack);
      }

      process.exit(1);
    });
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  syncRelease,
  parseReleaseBody,
  validateGitHubEntities,
  formatValidationErrors,
  CATEGORY_MAP,
};
