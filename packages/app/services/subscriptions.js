const { SubscriptionsRepository } = require("../repositories");
const { DefaultSubscriptionPlan } = require("../utils/constants");

class SubscriptionService {
  constructor() {
    this.subscriptionRepository = new SubscriptionsRepository();
  }

  /**
   * Gets Subscription by Id.
   * @param {string} subscriptionId - The subscription_id of the user.
   * @returns {Promise<Object>} - Subscription Object.
   */
  async getSubscription(subscriptionId) {
    return await this.subscriptionRepository.getById(subscriptionId);
  }

  /**
   * Create a new Default Subscription Plan for User.
   * @returns {Promise<Object>} - Subscription Object.
   */
  async createSubscription() {
    const now = new Date();
    const end = new Date();
    end.setMonth(now.getMonth() + 1);
    const subscription = {
      start_date: now,
      end_date: end,
      ...DefaultSubscriptionPlan,
    };
    return await this.subscriptionRepository.create(subscription);
  }

  /**
   * Increments the API usage count using subscriptionID.
   * @param {string} subscriptionId - subscriptionID of subscription
   *  @returns {Promise<Object>} - The subscription details.
   **/
  async incrementUsageCount(subscription) {
    const data = {
      usage_count: subscription.usage_count + 1,
    };
    return await this.subscriptionRepository.update(subscription._id, data);
  }

  /**
   * Gets all API usage count from the database.
   * @returns {Promise<number>} - Returns a promise with total no of subscriptions.
   */
  async getSubscriptionUsageCount() {
    return await this.subscriptionRepository.getSubscriptionUsageCount();
  }
}

module.exports = SubscriptionService;
