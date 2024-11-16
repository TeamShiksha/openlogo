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
      { $match: { key: apiKeys } },
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
   * Checks if a given API key is present in the database.
   * @param {string} apiKey - API key to check.
   * @returns {Promise<Array<Object>>} - Array of matching keys.
   *                                   - Returns an empty array if no matches are found.
   */
  async isAPIKeyPresent(apiKey) {
    const keyRef = await Keys.find({ key: apiKey });
    return keyRef;
  }

  /**
   * Fetches a single user based on their API key.
   * @param {string} apiKey - API key of the user.
   * @returns {Promise<Object|null>} - User object if found, otherwise null.
  */
  async fetchUser(apiKey) {
    const key = await Keys.findOne({ key: apiKey });
    return key;
  }
}

module.exports = KeysRepository;
