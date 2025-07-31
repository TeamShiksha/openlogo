const { SubscriptionsRepository } = require("../../../repositories");
const SubscriptionService = require("../../../services/subscriptions");
const { MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

describe("Get total subscription count", () => {
  let subscriptionService;
  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  it("Get total usage count for all subscriptions", async () => {
    const subscriptionCount = MOCK_SUBSCRIPTION.reduce(
      (totalCount, currentSubscription) => {
        return totalCount + currentSubscription.usage_count;
      },
      0
    );
    const spy = jest
      .spyOn(SubscriptionsRepository.prototype, "getSubscriptionUsageCount")
      .mockResolvedValue(subscriptionCount);

    const result = await subscriptionService.getSubscriptionUsageCount();
    expect(result).toBeDefined();
    expect(result).toBe(subscriptionCount);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
