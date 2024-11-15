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

  async incrementUsageCount(subscriptionId) {
      return Subscriptions.updateOne(
        { _id: subscriptionId },
        { $inc: { usageCount: 1 } }
      );
  }

  async updateApiUsageCount(userId) {
      const subscription = await Subscriptions.updateOne(
        { user: userId },
        { $inc: { usageCount: 1 } }
      );
      return subscription;
  }

  async fetchApiUsage(userId) {
      const subscription = await Subscriptions.findOne({ user: userId });
      return subscription; 
  }
}

module.exports = SubscriptionsRepository;
