const BaseRepository = require("../repositories/base");
const Request = require("../models/Request");

/**
 * The Request Repository extends BaseRepository to manage Request model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Request model to the base repository for database interactions.
 *  Custom methods specific to Request can also be added as needed.
 */
class RequestRepository extends BaseRepository {
  constructor() {
    super(Request);
  }
}

module.exports = RequestRepository;
