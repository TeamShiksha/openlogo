const Subscriptions = require("../../../models/subscriptions");
const { SubscriptionsRepository } = require("../../../repositories");
const SubscriptionService = require("../../../services/subscriptions");
const { MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

describe("Increment usage count", () => {
  let subscriptionService;
  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  it("increment usage count for a subscription", async () => {
    const subscription = new Subscriptions(MOCK_SUBSCRIPTION[0]);
    const updatedSubscription = {
      ...subscription.toObject(),
      usage_count: subscription.usage_count + 1,
    };
    jest
      .spyOn(SubscriptionsRepository.prototype, "update")
      .mockResolvedValue(updatedSubscription);

    const result = await subscriptionService.incrementUsageCount(subscription);

    expect(result).toBeDefined();
    expect(result.usage_count).toBe(1);
  });
});
