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

  /**
   * Fetches a user and their subscription details using API key.
   * @param {string} apiKeys -  API key.
   * @returns {Promise<Object>} - User objects with subscription details.
   */
  async fetchUserWithSubscription(apiKeys) {
    const userWithSubscription = await Keys.aggregate([
      { $match: { api_key: apiKeys } },
      {
        $lookup: {
          from: "subscriptions",
          localField: "user",
          foreignField: "user",
          as: "subscriptionDetails",
        },
      },
      { $unwind: "$subscriptionDetails" },
    ]);
    return userWithSubscription;
  }

  /**
   * Gets a given API key from the database.
   * @param {string} apiKey - API key to check.
   * @returns {Promise<Array<Object>>} - Array of matching keys. Returns an empty array if no matches are found.
   */
  async getApiKey(apiKey) {
    const keyRef = await Keys.findOne({ api_key: apiKey });
    return keyRef;
  }
}

module.exports = KeysRepository;
