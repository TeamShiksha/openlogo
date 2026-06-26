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
    const end = new Date(now);
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
   * @returns {Promise<number>} - Returns a old usage count + 1 is success else null 
   **/
  async incrementUsageCount(subscriptionId) {
   return  await this.subscriptionRepository.incrementUsageCount(subscriptionId);
  }

  /**
   * Gets all API usage count from the database.
   * @returns {Promise<number>} - Returns a promise with total no of subscriptions.
   */
  async getSubscriptionUsageCount() {
    return await this.subscriptionRepository.getSubscriptionUsageCount();
  }

  /**
   * change the end-date to the next month of current date  and start date to the current date and also make the usage count=0 for new month
   * @param {number} subscriptionId - id of the subscription
   * 
   */
  async resetLimitAndExpiryDate(subscriptionId) {
    await this.subscriptionRepository.resetLimitAndExpiryDate(subscriptionId);
  }
}

module.exports = SubscriptionService;
