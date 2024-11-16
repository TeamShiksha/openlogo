const BaseRepository = require('./base');
const ContactUs = require('../models/ContactUs');

/**
 * The ContactUsRepository extends BaseRepository to manage ContactUs model operations,
 * inheriting CRUD methods like getById, getAll, create, update, and delete.
 * It passes the ContactUs model to the base repository for database interactions.
 * Custom methods specific to ContactUs and operator functionality can also be added as needed.
 */
class ContactUsRepository extends BaseRepository {
  constructor() {
    super(ContactUs);
  }

  /**
   * Fetches paginated operator data based on the given criteria.
   * @param {string} type - Type of data to filter.
   * @param {number} page - Page number for pagination.
   * @param {number} limit - Limit per page.
   * @param {Object} filter - Additional filter criteria.
   * @returns {Promise<Object>} - Paginated data result.
   */
  async fetchWithPagination(type, page, limit, filter = {}) {
    const query = { type, ...filter };
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments(query);
    const data = await this.model.find(query).skip(skip).limit(limit);
    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = ContactUsRepository;
