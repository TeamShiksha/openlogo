const BaseRepository = require("./base.repository");
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

  async isAPIKeyPresent(apiKey) {
      const keyRef = await Keys.find({ key: apiKey });
      return keyRef;
  }

  async fetchUser(apiKey) {
      const key = await Keys.findOne({ key: apiKey });
      return key;
  }
}

module.exports = KeysRepository;
