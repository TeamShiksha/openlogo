const api_request = require("../models/api_request");
const BaseRepository = require("./base");
/**
 * The ApiRequest Repository extends BaseRepository to manage ApiRequest model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the ApiRequest model to the base repository for database interactions.
 *  Custom methods specific to ApiRequest can also be added as needed.
 */
class ApiRequestRepository extends BaseRepository {
  constructor() {
    super(api_request);
  }
}

module.exports = ApiRequestRepository;
