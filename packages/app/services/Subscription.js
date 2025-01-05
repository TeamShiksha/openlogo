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
}

module.exports = SubscriptionService;
