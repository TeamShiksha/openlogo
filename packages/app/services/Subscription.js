const SubscriptionsRepository = require("../repositories/Subscriptions");

class SubscriptionServices {
  constructor() {
    this.subscriptionsRepository = new SubscriptionsRepository();
  }

  /**
   * Checks if the user is allowed to make API calls
   * @param {string} userId - userId of user
   * @returns {Promise<boolean>} - True if it exceeds the limit, otherwise false
   **/
  async isApiUsageLimitExceed(userId) {
    try {
      const subscription = await this.subscriptionsRepository.fetchApiUsage(userId);
      if (subscription.usage_count >= subscription.usage_limit) return true;
      else return false;
    } catch (error) {
      throw error
    }
  }

  /**
   * Updates the API usage count for a given user.
   * @param {string} userId - userId of user
   *  @returns {Promise<number|null>} - The number of documents modified, or null if no document was found to update.
   **/
  async updateApiUsageCount(userId) {
    try {
      const subscription = await this.subscriptionsRepository.updateApiUsageCount(userId);
      if (!subscription.matchedCount === 0) return null;
      return subscription.modifiedCount;
    } catch (error) {
      throw error
    }
  }

  /**
   * Increments the API usage count using subscriptionID.
   * @param {string} subscriptionId - subscriptionID of subscription
   *  @returns {Promise<Object>} - The subscription details.
   **/
  async incrementUsageCount(subscriptionId) {
    try {
      const subscription = await this.subscriptionsRepository.incrementUsageCount(subscriptionId);
      return subscription;
    } catch (error) {
      throw error
    }
  }
}

module.exports = SubscriptionServices;
