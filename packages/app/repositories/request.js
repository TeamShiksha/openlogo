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

  async updateRequestStatus(id, updateData) {
    return await this.model.updateOne({ _id: id }, updateData);
  }
  async getRequestsCount() {
    return await this.model.countDocuments();
  }
}

module.exports = RequestRepository;
