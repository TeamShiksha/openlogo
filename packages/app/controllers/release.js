const { STATUS_CODES } = require("node:http");
const { ReleaseService } = require("../services");
const { OLD_RELEASES } = require("../utils/constants");

/**
 * GET /api/releases          → paginated list of all releases
 * GET /api/releases/:version → single release by version tag
 *
 * When :version is present: returns the matching release or 404.
 * When :version is absent:  returns releases in reverse-chronological order.
 *   Query params:
 *     - page  {number} default: 1
 *     - limit {number} default: 10
 */
async function getReleasesController(req, res, next) {
  try {
    const releaseService = new ReleaseService();
    const { version } = req.params;

    // --- Single release by version ---
    if (version) {
      const release = await releaseService.getReleaseByVersion(version);

      if (!release) {
        return res.status(404).json({
          statusCode: 404,
          error: STATUS_CODES[404],
          message: `Release ${version} not found.`,
        });
      }

      return res.status(200).json({
        statusCode: 200,
        data: release,
      });
    }

    // --- All releases (paginated) ---
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

    const result = await releaseService.getAllReleases(page, limit);

    return res.status(200).json({
      statusCode: 200,
      data: result.data,
      pagination: {
        total: result.total,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
        limit,
      },
      // Appended historical archive. Note: Pagination logic does not apply to this array.
      archivedReleases: OLD_RELEASES,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReleasesController,
};
