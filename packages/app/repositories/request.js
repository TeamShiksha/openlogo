const BaseRepository = require("../repositories/base");
const Request = require("../models/request");

/**
 * The Request Repository extends BaseRepository to manage Request model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Request model to the base repository for database interactions.
 *  Custom methods specific to Request can also be added as needed.
 */
class RequestRepository extends BaseRepository {
  constructor() {
    super(Request);
  }

  /**
   * finds a request for the given userId and status
   * @param {string} userId - ID of the user
   * @param {string} status - status to filter
   * @returns {Promise<Object>} - returns the matching request document or null if doesn't exist
   */
  async findByUserAndStatus(userId, status) {
    return await this.model.findOne({ user_id: userId, status });
  }

  /**
   * finds a request for the given url and status
   * @param {string} companyUrl - url of the company
   * @param {string} status - status to filter
   * @returns {Promise<Object>} - returns the matching request document or null if doesn't exist
   */
  async findByCompanyUrlAndStatus(companyUrl, status) {
    return await this.model.findOne({ companyUrl, status });
  }

  /**
   * updates status and other fields of specific request
   * @param {string} id - ID of the request
   * @param {Object} updateData - updated Data of the request
   * @returns {Promise<Object>} - returns the result
   */
  async updateRequestStatus(id, updateData) {
    return await this.model.updateOne({ _id: id }, updateData);
  }

  /**
   *
   * @returns {Promise<number>} - returns the total number of requests
   */
  async getRequestsCount() {
    return await this.model.countDocuments();
  }

  /**
   *
   * @returns {Promise<number>} - returns the total number of requests with status 'RESOLVED'
   */
  async getHitsCount() {
    return await this.model.countDocuments({ status: "RESOLVED" });
  }
}

module.exports = RequestRepository;
