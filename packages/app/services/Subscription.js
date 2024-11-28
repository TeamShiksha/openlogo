const SubscriptionRepository = require("../repositories/Subscriptions");
const { DefaultSubscriptionPlan } = require("../utils/constants");

class SubscriptionService {
  constructor() {
    this.subscriptionRepository = new SubscriptionRepository();
  }

  /**
   * Gets Subscription by Id.
   * @param {string} subscriptionId - The subscription_id of the user.
   * @returns {Object} - Subscription Object.
  */
  async getSubscription(subscriptionId) {
    return await this.subscriptionRepository.getById(subscriptionId);
  }
  
  /**
   * Create a new Default Subscription Plan for User.
   * @returns {Object} - Subscription Object.
  */
  async createSubscription() {
      return await this.subscriptionRepository.create(DefaultSubscriptionPlan);
  }

  /**
   * Checks if the user is allowed to make API calls
   * @param {string} userId - userId of user
   * @returns {Promise<boolean>} - True if it exceeds the limit, otherwise false
   **/
  async isApiUsageLimitExceed(userId) {
    const subscription = await this.subscriptionRepository.fetchApiUsage(userId);
    return subscription.usage_count >= subscription.usage_limit;
  }

  /**
   * Updates the API usage count for a given user.
   * @param {string} userId - userId of user
   *  @returns {Promise<number|null>} - The number of documents modified, or null if no document was found to update.
   **/
  async updateApiUsageCount(userId) {
    const subscription = await this.subscriptionRepository.updateApiUsageCount(userId);
    if (!subscription.matchedCount == 0) return null;
    return subscription.modifiedCount;
  }

  /**
   * Increments the API usage count using subscriptionID.
   * @param {string} subscriptionId - subscriptionID of subscription
   *  @returns {Promise<Object>} - The subscription details.
   **/
  async incrementUsageCount(subscriptionId) {
    const subscription = await this.subscriptionRepository.incrementUsageCount(subscriptionId);
    return subscription;
  }
}

module.exports = SubscriptionService;