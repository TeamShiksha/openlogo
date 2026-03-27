/**
 * Reward System Tests
 *
 * These tests demonstrate how to test the reward system implementation.
 * Tests use mocking to avoid database dependencies.
 */

const RewardTrackingService = require("../../services/rewardTransactions");
const RewardsService = require("../../services/rewards");
const { SubscriptionTypes } = require("../../utils/constants");
const mongoose = require("mongoose");
const {
  MOCK_LOG_ENTRY_HOBBY,
  MOCK_LOG_ENTRY_SELF_USAGE,
  MOCK_LOG_ENTRY_DUPLICATE,
  MOCK_LOG_ENTRY_VALID,
  createMockRewardRecordEmpty,
  createMockRewardRecord5Achieved,
  MOCK_ELIGIBLE_LOG_ENTRIES_5,
  MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND,
  MOCK_ELIGIBLE_LOG_ENTRIES_15,
  MOCK_REWARD_CREATOR_USER,
  MOCK_REWARD_USER_WITH_POINTS,
  MOCK_USER_REWARD_RECORDS,
  MOCK_UNREVERSED_TRANSACTION,
  MOCK_REVERSED_TRANSACTION,
  MOCK_PAGINATED_REWARDS_FOR_LEADERBOARD,
  REWARD_TEST_IMAGE_ID,
  MOCK_MILESTONE_CONFIG,
} = require("../../utils/mocks");

describe("Reward System", () => {
  let rewardTrackingService;
  let rewardsService;

  beforeEach(() => {
    rewardTrackingService = new RewardTrackingService();
    rewardsService = new RewardsService();
    jest.clearAllMocks();
  });

  describe("RewardTrackingService.validateAndLogRequest", () => {
    it("should mark Hobby user requests as non-eligible", async () => {
      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "create")
        .mockResolvedValue(MOCK_LOG_ENTRY_HOBBY);

      const result = await rewardTrackingService.validateAndLogRequest({
        imageId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        creatorId: new mongoose.Types.ObjectId(),
        keyId: new mongoose.Types.ObjectId(),
        subscriptionId: new mongoose.Types.ObjectId(),
        subscription: { type: SubscriptionTypes.HOBBY },
      });

      expect(result.is_reward_eligible).toBe(false);
      expect(result.reward_eligibility_reason).toBe("HOBBY_USER");
    });

    it("should mark self-usage as non-eligible", async () => {
      const userId = new mongoose.Types.ObjectId();

      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "create")
        .mockResolvedValue(MOCK_LOG_ENTRY_SELF_USAGE);

      const result = await rewardTrackingService.validateAndLogRequest({
        imageId: new mongoose.Types.ObjectId(),
        userId,
        creatorId: userId,
        keyId: new mongoose.Types.ObjectId(),
        subscriptionId: new mongoose.Types.ObjectId(),
        subscription: { type: SubscriptionTypes.PRO },
      });

      expect(result.is_reward_eligible).toBe(false);
      expect(result.reward_eligibility_reason).toBe("SELF_USAGE");
    });

    it("should mark duplicate requests as non-eligible", async () => {
      // Simulate an existing eligible log for the same image + user
      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "find")
        .mockResolvedValue([MOCK_LOG_ENTRY_VALID]);
      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "create")
        .mockResolvedValue(MOCK_LOG_ENTRY_DUPLICATE);

      const result = await rewardTrackingService.validateAndLogRequest({
        imageId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        creatorId: new mongoose.Types.ObjectId(),
        keyId: new mongoose.Types.ObjectId(),
        subscriptionId: new mongoose.Types.ObjectId(),
        subscription: { type: SubscriptionTypes.PRO },
      });

      expect(result.is_reward_eligible).toBe(false);
      expect(result.reward_eligibility_reason).toBe("DUPLICATE_USAGE");
    });

    it("should mark valid Pro user request as eligible", async () => {
      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "find")
        .mockResolvedValue([]);
      jest
        .spyOn(rewardTrackingService.logoRequestLogsRepository, "create")
        .mockResolvedValue(MOCK_LOG_ENTRY_VALID);
      jest
        .spyOn(rewardTrackingService.imagesRepository, "update")
        .mockResolvedValue({});

      const result = await rewardTrackingService.validateAndLogRequest({
        imageId: new mongoose.Types.ObjectId(),
        userId: new mongoose.Types.ObjectId(),
        creatorId: new mongoose.Types.ObjectId(),
        keyId: new mongoose.Types.ObjectId(),
        subscriptionId: new mongoose.Types.ObjectId(),
        subscription: { type: SubscriptionTypes.PRO },
      });

      expect(result.is_reward_eligible).toBe(true);
      expect(result.reward_eligibility_reason).toBe("VALID");
    });
  });

  describe("RewardsService.processRewardsForImage", () => {
    const setupProcessRewardsMocks = (eligibleLogs, rewardRecord) => {
      jest
        .spyOn(rewardsService.milestoneConfigRepository, "findActive")
        .mockResolvedValue(MOCK_MILESTONE_CONFIG);
      jest.spyOn(rewardsService.imagesRepository, "getById").mockResolvedValue({
        _id: REWARD_TEST_IMAGE_ID,
        user_id: MOCK_REWARD_CREATOR_USER._id,
        company_name: "GOOGLE",
      });
      jest
        .spyOn(rewardsService.logoRequestLogsRepository, "find")
        .mockResolvedValue(eligibleLogs);
      jest
        .spyOn(rewardsService.rewardsRepository, "findOrCreateByImageId")
        .mockResolvedValue(rewardRecord);
      jest
        .spyOn(rewardsService.rewardsRepository, "update")
        .mockResolvedValue({});
      jest
        .spyOn(rewardsService.usersRepository, "getById")
        .mockResolvedValue(MOCK_REWARD_CREATOR_USER);
      jest
        .spyOn(rewardsService.usersRepository, "update")
        .mockResolvedValue({});
      jest
        .spyOn(rewardsService.rewardTransactionsRepository, "createTransaction")
        .mockResolvedValue({});
      jest
        .spyOn(rewardsService.imagesRepository, "update")
        .mockResolvedValue({});
    };

    it("should award points when a single milestone is reached", async () => {
      // 5 new unique Pro users → milestone 5 (10 pts)
      setupProcessRewardsMocks(
        MOCK_ELIGIBLE_LOG_ENTRIES_5,
        createMockRewardRecordEmpty()
      );

      const result =
        await rewardsService.processRewardsForImage(REWARD_TEST_IMAGE_ID);

      expect(result.success).toBe(true);
      expect(result.newMilestones).toBeDefined();
      expect(result.newMilestones.length).toBe(1);
      expect(result.newMilestones[0].milestone).toBe(5);
      expect(result.totalPointsAwarded).toBe(10);
    });

    it("should award multiple milestones for high usage", async () => {
      // 15 new unique Pro users → milestones 5, 10, 15 (30 pts)
      setupProcessRewardsMocks(
        MOCK_ELIGIBLE_LOG_ENTRIES_15,
        createMockRewardRecordEmpty()
      );

      const result =
        await rewardsService.processRewardsForImage(REWARD_TEST_IMAGE_ID);

      expect(result.success).toBe(true);
      expect(result.newMilestones.length).toBe(3);
      expect(result.totalPointsAwarded).toBe(30);
    });

    it("should not award duplicate milestones", async () => {
      setupProcessRewardsMocks(
        [...MOCK_ELIGIBLE_LOG_ENTRIES_5, ...MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND],
        createMockRewardRecord5Achieved()
      );

      const result =
        await rewardsService.processRewardsForImage(REWARD_TEST_IMAGE_ID);

      expect(result.success).toBe(true);
      expect(result.newMilestones.length).toBe(1);
      expect(result.newMilestones[0].milestone).toBe(10);
    });
  });

  describe("RewardsService.getUserRewardData", () => {
    it("should return user reward data with correct point totals", async () => {
      jest
        .spyOn(rewardsService.usersRepository, "getById")
        .mockResolvedValue(MOCK_REWARD_USER_WITH_POINTS);
      jest
        .spyOn(rewardsService.rewardsRepository, "findByUserId")
        .mockResolvedValue(MOCK_USER_REWARD_RECORDS);

      const summary = await rewardsService.getUserRewardData(
        MOCK_REWARD_USER_WITH_POINTS._id
      );

      expect(summary).toBeDefined();
      expect(summary.currentPoints).toBe(
        MOCK_REWARD_USER_WITH_POINTS.reward_points_current
      );
      expect(summary.lifetimePoints).toBe(
        MOCK_REWARD_USER_WITH_POINTS.reward_points_lifetime
      );
      expect(summary.totalImages).toBe(MOCK_USER_REWARD_RECORDS.length);
    });
  });

  describe("RewardsService.getRewardsLeaderboard", () => {
    it("should return top creators ordered by total points awarded", async () => {
      jest
        .spyOn(rewardsService.rewardsRepository, "getPaginatedRewards")
        .mockResolvedValue(MOCK_PAGINATED_REWARDS_FOR_LEADERBOARD);

      const leaderboard = await rewardsService.getRewardsLeaderboard(3);

      expect(leaderboard.length).toBeLessThanOrEqual(3);
      expect(leaderboard[0].rank).toBe(1);
      if (leaderboard.length > 1) {
        expect(leaderboard[0].totalPointsAwarded).toBeGreaterThanOrEqual(
          leaderboard[1].totalPointsAwarded
        );
      }
    });
  });

  describe("RewardsService.reverseTransaction", () => {
    it("should reverse a reward transaction and update user points", async () => {
      const adminId = new mongoose.Types.ObjectId();
      const transactionId = MOCK_UNREVERSED_TRANSACTION._id;

      jest
        .spyOn(
          rewardsService.rewardTransactionsRepository,
          "getTransactionById"
        )
        .mockResolvedValue(MOCK_UNREVERSED_TRANSACTION);
      jest
        .spyOn(
          rewardsService.rewardTransactionsRepository,
          "reverseTransaction"
        )
        .mockResolvedValue(MOCK_REVERSED_TRANSACTION);
      jest
        .spyOn(rewardsService.usersRepository, "getById")
        .mockResolvedValue(MOCK_REWARD_CREATOR_USER);
      jest
        .spyOn(rewardsService.usersRepository, "update")
        .mockResolvedValue({});
      jest
        .spyOn(rewardsService.rewardTransactionsRepository, "createTransaction")
        .mockResolvedValue({});

      const result = await rewardsService.reverseTransaction(
        transactionId,
        adminId,
        "Abuse detected"
      );

      expect(result.is_reversed).toBe(true);
      expect(result.points_awarded).toBe(
        MOCK_UNREVERSED_TRANSACTION.points_awarded
      );
    });
  });
});
