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
   * get all requests from db.
   * @returns {Promise<number>} - total number of requests.
   */
  async getRequestsCount() {
    return await Request.countDocuments();
  }

  /**
   * get all hits for all requests from db.
   * @returns {Promise<number>} - total number of hits.
   *
   */
  async getHitsCount() {
    return await Request.countDocuments({ status: "COMPLETED" });
  }
}

module.exports = RequestRepository;
