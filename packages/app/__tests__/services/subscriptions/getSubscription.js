const Subscriptions = require("../../../models/subscriptions");
const { SubscriptionsRepository } = require("../../../repositories");
const SubscriptionService = require("../../../services/subscriptions");
const { MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

describe("Get a subscription", () => {
  let subscriptionService;
  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  it("Get a subscription", async () => {
    const subscription = new Subscriptions(MOCK_SUBSCRIPTION[0]);
    const spy = jest
      .spyOn(SubscriptionsRepository.prototype, "getById")
      .mockResolvedValue(subscription);

    const result = await subscriptionService.getSubscription(subscription.id);
    expect(result).toBeDefined();
    expect(result.key_limit).toBe(2);
    expect(result.usage_limit).toBe(5000);
    expect(spy).toHaveBeenCalledWith(subscription.id);
  });

  it("Return null for invalid subscription id", async () => {
    const subscriptionId = "invalid-id";
    const spy = jest
      .spyOn(SubscriptionsRepository.prototype, "getById")
      .mockResolvedValue(null);

    const result = await subscriptionService.getSubscription(subscriptionId);
    expect(result).toBe(null);
    expect(spy).toHaveBeenCalledWith(subscriptionId);
  });
});
