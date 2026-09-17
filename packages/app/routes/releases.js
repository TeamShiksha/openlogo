const router = require("express").Router();
const {
  getReleasesController,
  getReleaseVersionsController,
} = require("../controllers/release");

/**
 * GET /api/releases/versions
 * Returns a lightweight list of all available releases.
 * Return only version and releaseDate, sorted in reverse chronological order.
 * No authentication required.
 *
 * GET /api/releases
 * Returns all releases in reverse-chronological order (paginated).
 * Query params: page (default: 1), limit (default: 10)
 *
 * GET /api/releases/:version
 * Returns a single release by version tag (e.g. "v1.2.0").
 * Returns 404 if the version does not exist.
 *
 * Public — no authentication required.
 */
router.get("/versions", getReleaseVersionsController);
router.get("/:version?", getReleasesController);

module.exports = router;
