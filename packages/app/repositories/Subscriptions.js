const BaseRepository = require("./base");
const Subscriptions = require("../models/Subscriptions");

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
   * Increments the API usage count for a specific subscription.
   * @param {string} subscriptionId - ID of the subscription to update.
   * @returns {Promise<Object>} - Result of the update operation contains details like matched count and modified count.
  */
  async incrementUsageCount(subscriptionId) {
    return Subscriptions.updateOne(
      { _id: subscriptionId },
      { $inc: { usageCount: 1 } }
    );
  }

  /**
   * Increments the API usage count for a user's subscription.
   * @param {string} userId - ID of the user whose subscription will be updated.
   * @returns {Promise<Object>} - Result of the update operation contains details like matched count and modified count.
  */
  async updateApiUsageCount(userId) {
    const subscription = await Subscriptions.updateOne(
      { user: userId },
      { $inc: { usageCount: 1 } }
    );
    return subscription;
  }

  /**
   * Fetches API usage details for a specific user.
   * @param {string} userId - ID of the user whose API usage is being retrieved.
   * @returns {Promise<Object|null>} - Subscription object containing API usage details returns null if no subscription is found.
  */
  async fetchApiUsage(userId) {
    const subscription = await Subscriptions.findOne({ user: userId });
    return subscription;
  }
}

module.exports = SubscriptionsRepository;
