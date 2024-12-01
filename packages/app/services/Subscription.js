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
    
}

module.exports = SubscriptionService;
