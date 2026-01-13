const { CreateLogo } = require("../models");
const BaseRepository = require("./base");

/**
 * The  createLogoRepository extends BaseRepository to manage createLogo model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the createLogo model to the base repository for database interactions.
 *  Custom methods specific to Request can also be added as needed.
 */

class CreateLogoRepository extends BaseRepository {
  constructor() {
    super(CreateLogo);
  }
}

module.exports = CreateLogoRepository;
