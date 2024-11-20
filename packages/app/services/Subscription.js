const SubscriptionRepository = require("../repositories/Subscriptions");

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
    
}

module.exports = SubscriptionService;