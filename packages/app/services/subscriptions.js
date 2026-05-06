const {
  SubscriptionsRepository,
  SubscriptionLogRepository,
} = require("../repositories");
const {
  DefaultSubscriptionPlan,
  ProSubscriptionPlan,
  SubscriptionTypes,
} = require("../utils/constants");

class SubscriptionService {
  constructor() {
    this.subscriptionRepository = new SubscriptionsRepository();
    this.subscriptionLogRepository = new SubscriptionLogRepository();
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

  /**
   * Gets all API usage count from the database.
   * @returns {Promise<number>} - Returns a promise with total no of subscriptions.
   */
  async getSubscriptionUsageCount() {
    return await this.subscriptionRepository.getSubscriptionUsageCount();
  }

  /**
   * Changes a user's subscription plan (admin-only).
   * Preserves the existing usage_count.
   * @param {string} subscriptionId - The subscription document ID.
   * @param {string} newPlanType - "HOBBY" or "PRO".
   * @returns {Promise<Object>} - Updated subscription document.
   */
  async changeSubscriptionPlan(subscriptionId, newPlanType) {
    const planTemplate =
      newPlanType === SubscriptionTypes.PRO
        ? ProSubscriptionPlan
        : DefaultSubscriptionPlan;

    const update = {
      type: planTemplate.type,
      key_limit: planTemplate.key_limit,
      usage_limit: planTemplate.usage_limit,
      is_active: planTemplate.is_active,
      updated_at: new Date(),
    };

    return await this.subscriptionRepository.findOneAndUpdate(
      { _id: subscriptionId },
      { $set: update },
      { new: true, runValidators: true }
    );
  }

  /**
   * Creates an audit log entry for a subscription plan change.
   * @param {Object} logData - { user_id, subscription_id, changed_by, from_plan, to_plan, reason? }
   * @returns {Promise<Object>} - Created log document.
   */
  async createSubscriptionLog(logData) {
    return await this.subscriptionLogRepository.create(logData);
  }
}

module.exports = SubscriptionService;
