const BaseRepository = require("./base");
const Release = require("../models/release");

class ReleaseRepository extends BaseRepository {
  constructor() {
    super(Release);
  }

  /**
   * Find a release document by its version tag (e.g. "v1.2.0")
   * @param {string} version
   * @returns {Promise<Object|null>}
   */
  async findByVersion(version) {
    return await this.model.findOne({ version }).select("-__v");
  }

  /**
   * Idempotent upsert — insert if version is new, replace all fields if it exists.
   * Uses a single atomic findOneAndUpdate so there is no partial-write risk.
   * @param {string} version
   * @param {Object} data - Full release document payload (excluding version)
   * @returns {Promise<Object>} - The updated/inserted document
   */
  async upsertByVersion(version, data) {
    return await this.model.findOneAndUpdate(
      { version },
      { $set: { version, ...data } },
      { upsert: true, new: true, runValidators: true }
    );
  }

  /**
   * Return releases in reverse-chronological order with pagination metadata.
   * @param {number} page - 1-indexed page number
   * @param {number} limit - Results per page
   * @returns {Promise<{ data: Array, total: number, currentPage: number, totalPages: number }>}
   */
  async getPaginated(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.model
        .find({})
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(limit)
        .select("-__v"),
      this.model.countDocuments({}),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = ReleaseRepository;
