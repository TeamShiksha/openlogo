const Subscriptions = require("../../../models/subscriptions");
const { SubscriptionsRepository } = require("../../../repositories");
const SubscriptionService = require("../../../services/subscriptions");
const { MOCK_SUBSCRIPTION } = require("../../../utils/mocks");

describe("Create a subscription", () => {
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
});
