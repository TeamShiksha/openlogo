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
        $match: { is_active: true },
      },
      {
        $group: {
          _id: null,
          totalUsage: { $sum: "$usage_count" },
        },
      },
    ]);
    return result.length > 0 ? result[0].totalUsage : 0;
  }

  /**
   *  update the subscription end date  start date and usage count
   * @param {number} subscriptionId
   */
  async resetLimitAndExpiryDate(subscriptionId) {
    await this.model.updateOne(
      { _id: subscriptionId, end_date: { $lt: new Date() } },
      [
        {
          $set: {
            start_date: "$$NOW",
            end_date: {
              $dateAdd: {
                startDate: "$$NOW",
                unit: "month",
                amount: 1,
              },
            },
            usage_count: 0,
          },
        },
      ]
    );
  }

  /**
   * Increament the usage count
   * @param {number} subscriptionId
   */
  async incrementUsageCount(subscriptionId) {
   return await this.update(
      {
        _id: subscriptionId,
        $expr: { $lt: ["$usage_count", "$usage_limit"] },
      },
      { $inc: { usage_count: 1 } },
      { new: true }
    );
  }
}

module.exports = SubscriptionsRepository;
