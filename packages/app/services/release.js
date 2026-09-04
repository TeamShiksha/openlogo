const { ReleaseRepository } = require("../repositories");
const { OLD_RELEASES } = require("../utils/constants");

/**
 * ReleaseService: Read-only service layer for the releases API.
 *
 * Write operations (sync from GitHub) are handled by scripts/syncReleases.js
 * which calls ReleaseRepository.upsertByVersion directly.
 */
class ReleaseService {
  constructor() {
    this.releaseRepository = new ReleaseRepository();
  }

  /**
   * Returns a paginated list of releases in reverse-chronological order.
   * @param {number} page  - 1-indexed page number (default: 1)
   * @param {number} limit - Results per page (default: 10)
   * @returns {Promise<{ data: Array, total: number, currentPage: number, totalPages: number }>}
   */
  async getAllReleases(page = 1, limit = 10) {
    return await this.releaseRepository.getPaginated(page, limit);
  }

  /**
   * Returns a single release document matched by version tag, or null if not found.
   * If not found in the database, checks the archived OLD_RELEASES constants.
   * @param {string} version - e.g. "v1.2.0"
   * @returns {Promise<Object|null>}
   */
  async getReleaseByVersion(version) {
    // 1. Check if the version is in the historical archive
    const archivedRelease = OLD_RELEASES.find((r) => r.version === version);
    if (archivedRelease) {
      return archivedRelease;
    }

    // 2. Query MongoDB for newer releases
    return await this.releaseRepository.findByVersion(version);
  }
}

module.exports = ReleaseService;
