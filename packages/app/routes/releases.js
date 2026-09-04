const router = require("express").Router();
const { getReleasesController } = require("../controllers/release");

/**
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
router.get("/:version?", getReleasesController);

module.exports = router;
