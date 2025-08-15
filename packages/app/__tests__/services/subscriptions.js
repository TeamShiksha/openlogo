const Subscriptions = require("../../models/subscriptions");
const { SubscriptionsRepository } = require("../../repositories");
const SubscriptionService = require("../../services/subscriptions");
const { MOCK_SUBSCRIPTION } = require("../../utils/mocks");

describe("Subscription Service", () => {
  let subscriptionService;
  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  it("should create a new subscription using default plan", async () => {
    const subscription = new Subscriptions(MOCK_SUBSCRIPTION[0]);

    jest
      .spyOn(SubscriptionsRepository.prototype, "create")
      .mockResolvedValue(subscription);
    const result = await subscriptionService.createSubscription();

    expect(result).toBeDefined();
    expect(result.key_limit).toBe(2);
  });

  it("get a subscription", async () => {
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
