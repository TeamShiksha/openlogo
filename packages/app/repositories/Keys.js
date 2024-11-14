const BaseRepository = require("../repositories/base");
const Keys = require("../models/Keys");

/**
 * The Keys Repository extends BaseRepository to manage ContactUs model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Keys model to the base repository for database interactions.
 *  Custom methods specific to Keys can also be added as needed.
*/

class KeysRepository extends BaseRepository {
  constructor() {
    super(Keys);
  }

  /**
   * Get Multiple Keys at once from db.
   * @param {Array<Object>} keyIds - Array of keyId.
   * @returns {Array<Object>} - Keys Object Array.
   */
  async getMultipleKeys(keyIds) {
    return await this.model.find({
      '_id': { $in: keyIds }
    });
  }
}

module.exports = KeysRepository;
