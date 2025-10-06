const BaseRepository = require("./base");
const Subscriptions = require("../models/subscriptions");

/**
 * The SubscriptionsRepository extends BaseRepository to manage ContactUs model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Subscriptions model to the base repository for database interactions.
 *  Custom methods specific to Subscriptions can also be added as needed.
 */

class SubscriptionsRepository extends BaseRepository {
  constructor() {
    super(Subscriptions);
  }
  /**
   * Get all API usage counts from db.
   * @returns {Promise<number>} - total number of subscriptions.
   */
  async getSubscriptionUsageCount() {
    const result = await Subscriptions.aggregate([
      {
        $group: {
          _id: null,
          totalUsage: { $sum: "usage_count" },
        },
      },
    ]);
    return result.length > 0 ? result[0].totalUsage : 0;
  }
}

module.exports = SubscriptionsRepository;
