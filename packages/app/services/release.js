const { ReleaseRepository } = require("../repositories");

/**
 * ReleaseService: Read-only service layer for the releases API.
 *
 * Write operations (sync from GitHub or seeding historical data) are handled
 * by scripts/releases/syncNewReleases.js and scripts/releases/seedHistoricalReleases.js
 * which call ReleaseRepository directly.
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
   * Queries MongoDB directly.
   * @param {string} version - e.g. "0.8.0" or "v1.2.0"
   * @returns {Promise<Object|null>}
   */
  async getReleaseByVersion(version) {
    return await this.releaseRepository.findByVersion(version);
  }

  /**
   * Returns a lightweight list of all releases (version & releaseDate only) in reverse-chronological order.
   * @returns {Promise<Array<{ version: string, releaseDate: Date }>>}
   */
  async getReleaseVersions() {
    return await this.releaseRepository.getAllVersions();
  }
}

module.exports = ReleaseService;
