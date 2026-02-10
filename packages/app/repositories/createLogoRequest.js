const { CreateLogoRequest } = require("../models");
const BaseRepository = require("./base");

/**
 * The  createLogoRequestRepository extends BaseRepository to manage createLogoRequest model operations, inheriting CRUD methods like getById, getAll, create, update, and delete.
 * It passes the createLogoRequest model to the base repository for database interactions.
 * Custom methods specific to createLogoRequest can also be added as needed.
 */

class CreateLogoRequestRepository extends BaseRepository {
  constructor() {
    super(CreateLogoRequest);
  }

  /**
   * Finds a logo request matching the company URL and status.
   * @param {string} companyUrl - URL of the company
   * @param {string} status - Status to filter
   * @returns {Promise<Object>} - returns the matching request document or null if doesn't exist
   */
  async findByCompanyUrlAndStatus(companyUrl, status) {
    return await this.model.findOne({ companyUrl, status });
  }

  /**
   * Updates the status and related fields of a specific logo request
   * @param {string} id - ID of the created logo
   * @param {Object} updatedData - updated Data of the logo
   * @returns {Promise<Object>} - returns the result
   */
  async updateLogoStatus(id, updatedData) {
    return await this.model.updateOne({ _id: id }, updatedData);
  }
}

module.exports = CreateLogoRequestRepository;
