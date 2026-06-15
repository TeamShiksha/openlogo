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
  MOCK_USERS,
  MOCK_IMAGES,
  MOCK_LOG_ENTRY_HOBBY,
  MOCK_LOG_ENTRY_VALID,
  MOCK_MILESTONE_CONFIG,
} = require("../../utils/mocks");

const REWARD_TEST_IMAGE_ID = new mongoose.Types.ObjectId();
const REWARD_TEST_CREATOR_ID = new mongoose.Types.ObjectId();

const REWARD_TEST_PRO_USER_IDS_10 = Array.from(
  { length: 10 },
  () => new mongoose.Types.ObjectId()
);
const REWARD_TEST_PRO_USER_IDS_15 = Array.from(
  { length: 15 },
  () => new mongoose.Types.ObjectId()
);

const createMockRewardRecordEmpty = () => ({
  _id: new mongoose.Types.ObjectId(),
  image_id: REWARD_TEST_IMAGE_ID,
  user_id: REWARD_TEST_CREATOR_ID,
  unique_pro_users: [],
  unique_pro_users_count: 0,
  milestones_achieved: [],
  total_points_awarded: 0,
});

const createMockRewardRecord5Achieved = () => ({
  _id: new mongoose.Types.ObjectId(),
  image_id: REWARD_TEST_IMAGE_ID,
  user_id: REWARD_TEST_CREATOR_ID,
  unique_pro_users: [...REWARD_TEST_PRO_USER_IDS_10.slice(0, 5)],
  unique_pro_users_count: 5,
  milestones_achieved: [
    { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
  ],
  total_points_awarded: 10,
});

const MOCK_ELIGIBLE_LOG_ENTRIES_5 = REWARD_TEST_PRO_USER_IDS_10.slice(0, 5).map(
  (userId) => ({
    _id: new mongoose.Types.ObjectId(),
    user_id: userId,
    image_id: REWARD_TEST_IMAGE_ID,
    user_plan: SubscriptionTypes.PRO,
    is_reward_eligible: true,
    reward_eligibility_reason: "VALID",
    createdAt: new Date(),
  })
);

const MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND = REWARD_TEST_PRO_USER_IDS_10.slice(
  5,
  10
).map((userId) => ({
  _id: new mongoose.Types.ObjectId(),
  user_id: userId,
  image_id: REWARD_TEST_IMAGE_ID,
  user_plan: SubscriptionTypes.PRO,
  is_reward_eligible: true,
  reward_eligibility_reason: "VALID",
  createdAt: new Date(),
}));

const MOCK_ELIGIBLE_LOG_ENTRIES_15 = REWARD_TEST_PRO_USER_IDS_15.map(
  (userId) => ({
    _id: new mongoose.Types.ObjectId(),
    user_id: userId,
    image_id: REWARD_TEST_IMAGE_ID,
    user_plan: SubscriptionTypes.PRO,
    is_reward_eligible: true,
    reward_eligibility_reason: "VALID",
    createdAt: new Date(),
  })
);

const MOCK_REWARD_CREATOR_USER = {
  _id: REWARD_TEST_CREATOR_ID,
  name: "Creator User",
  email: "creator@example.com",
  reward_points_current: 0,
  reward_points_lifetime: 0,
};

const MOCK_REWARD_USER_WITH_POINTS = {
  _id: new mongoose.Types.ObjectId(),
  name: "Rewards User",
  email: "rewards@example.com",
  reward_points_current: 100,
  reward_points_lifetime: 500,
};

const MOCK_USER_REWARD_RECORDS = [
  {
    _id: new mongoose.Types.ObjectId(),
    image_id: MOCK_IMAGES[0]._id,
    user_id: MOCK_REWARD_USER_WITH_POINTS._id,
    unique_pro_users: Array.from(
      { length: 10 },
      () => new mongoose.Types.ObjectId()
    ),
    total_points_awarded: 20,
    milestones_achieved: [
      { milestone: 5, achieved_at: new Date(), points_awarded: 10 },
      { milestone: 10, achieved_at: new Date(), points_awarded: 10 },
    ],
  },
];

const MOCK_LOG_ENTRY_SELF_USAGE = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.PRO,
  response_size_bytes: 0,
  is_reward_eligible: false,
  reward_eligibility_reason: "SELF_USAGE",
  createdAt: new Date(),
};

const MOCK_LOG_ENTRY_DUPLICATE = {
  _id: new mongoose.Types.ObjectId(),
  user_plan: SubscriptionTypes.PRO,
  response_size_bytes: 0,
  is_reward_eligible: false,
  reward_eligibility_reason: "DUPLICATE_USAGE",
  createdAt: new Date(),
};

const MOCK_UNREVERSED_TRANSACTION = {
  _id: new mongoose.Types.ObjectId(),
  image_id: MOCK_IMAGES[0]._id,
  user_id: MOCK_USERS[0]._id,
  transaction_type: "MILESTONE_REWARD",
  points_awarded: 10,
  is_reversed: false,
  description: "Milestone 5 reached",
};

const MOCK_REVERSED_TRANSACTION = {
  ...MOCK_UNREVERSED_TRANSACTION,
  is_reversed: true,
  reversed_at: new Date(),
  reversal_reason: "Abuse detected",
};

const MOCK_AGGREGATED_LEADERBOARD = [
  {
    userId: MOCK_USERS[0]._id,
    name: "Creator A",
    email: "a@example.com",
    totalPointsAwarded: 30,
    milestonesAchieved: 3,
  },
  {
    userId: MOCK_USERS[1]._id,
    name: "Creator B",
    email: "b@example.com",
    totalPointsAwarded: 20,
    milestonesAchieved: 2,
  },
  {
    userId: MOCK_USERS[2]._id,
    name: "Creator C",
    email: "c@example.com",
    totalPointsAwarded: 10,
    milestonesAchieved: 1,
  },
];

describe("Reward System", () => {
  let rewardsService;

  beforeEach(() => {
    jest.clearAllMocks();
    rewardsService = new RewardsService();
  });

  describe("RewardTrackingService.validateAndLogRequest", () => {
    let rewardTrackingService;

    beforeEach(() => {
      rewardTrackingService = new RewardTrackingService();
    });
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
    let createTransactionSpy;

    const setupProcessRewardsMocks = (eligibleLogs, rewardRecord) => {
      const mockSession = {
        withTransaction: jest.fn((cb) => cb()),
        endSession: jest.fn(),
      };
      jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);

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
        .spyOn(rewardsService.usersRepository, "update")
        .mockResolvedValue({});
      createTransactionSpy = jest
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
      expect(result).toMatchObject({
        imageId: REWARD_TEST_IMAGE_ID,
        newUsersAdded: MOCK_ELIGIBLE_LOG_ENTRIES_5.length,
        totalPointsAwarded: 10,
        newMilestones: [
          expect.objectContaining({ milestone: 5, points_awarded: 10 }),
        ],
      });
      expect(result.newMilestones).toHaveLength(1);
      expect(createTransactionSpy).toHaveBeenCalledTimes(1);
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction_type: "MILESTONE_REWARD",
          milestone: 5,
          points_awarded: 10,
        }),
        expect.any(Object)
      );
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
      expect(result).toMatchObject({
        imageId: REWARD_TEST_IMAGE_ID,
        newUsersAdded: MOCK_ELIGIBLE_LOG_ENTRIES_15.length,
        totalPointsAwarded: 30,
        newMilestones: expect.arrayContaining([
          expect.objectContaining({ milestone: 5 }),
          expect.objectContaining({ milestone: 10 }),
          expect.objectContaining({ milestone: 15 }),
        ]),
      });
      expect(result.newMilestones).toHaveLength(3);
      expect(createTransactionSpy).toHaveBeenCalledTimes(3);
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 5, points_awarded: 10 }),
        expect.any(Object)
      );
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 10, points_awarded: 10 }),
        expect.any(Object)
      );
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({ milestone: 15, points_awarded: 10 }),
        expect.any(Object)
      );
    });

    it("should not award duplicate milestones", async () => {
      setupProcessRewardsMocks(
        [...MOCK_ELIGIBLE_LOG_ENTRIES_5, ...MOCK_ELIGIBLE_LOG_ENTRIES_5_SECOND],
        createMockRewardRecord5Achieved()
      );

      const result =
        await rewardsService.processRewardsForImage(REWARD_TEST_IMAGE_ID);

      expect(result.success).toBe(true);
      expect(result).toMatchObject({
        imageId: REWARD_TEST_IMAGE_ID,
        totalPointsAwarded: 10,
        newMilestones: [
          expect.objectContaining({ milestone: 10, points_awarded: 10 }),
        ],
      });
      expect(result.newMilestones).toHaveLength(1);
      expect(createTransactionSpy).toHaveBeenCalledTimes(1);
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction_type: "MILESTONE_REWARD",
          milestone: 10,
          points_awarded: 10,
        }),
        expect.any(Object)
      );
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
        .spyOn(rewardsService.rewardsRepository, "getLeaderboardAggregated")
        .mockResolvedValue(MOCK_AGGREGATED_LEADERBOARD);

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

  describe("RewardsService.awardBonusPoints", () => {
    it("should throw if imageId is missing", async () => {
      await expect(
        rewardsService.awardBonusPoints(null, MOCK_USERS[0]._id, 50)
      ).rejects.toThrow("Image ID is required");
    });

    it("should throw if image not found", async () => {
      jest
        .spyOn(rewardsService.imagesRepository, "getById")
        .mockResolvedValue(null);

      await expect(
        rewardsService.awardBonusPoints(
          new mongoose.Types.ObjectId(),
          MOCK_USERS[0]._id,
          50
        )
      ).rejects.toThrow("Image not found");
    });

    it("should throw if user not found", async () => {
      jest.spyOn(rewardsService.imagesRepository, "getById").mockResolvedValue({
        _id: new mongoose.Types.ObjectId(),
        user_id: MOCK_USERS[0]._id,
      });
      jest
        .spyOn(rewardsService.usersRepository, "getById")
        .mockResolvedValue(null);

      await expect(
        rewardsService.awardBonusPoints(
          new mongoose.Types.ObjectId(),
          MOCK_USERS[0]._id,
          50
        )
      ).rejects.toThrow("User not found");
    });

    it("should award bonus points, update rewards doc, user, and create transaction", async () => {
      const imageId = new mongoose.Types.ObjectId();
      const userId = MOCK_REWARD_CREATOR_USER._id;
      const points = 50;
      const reason = "PROMOTION";
      const description = "Bonus award";

      const mockRewardRecord = createMockRewardRecordEmpty();

      jest.spyOn(rewardsService.imagesRepository, "getById").mockResolvedValue({
        _id: imageId,
        user_id: userId,
      });
      jest
        .spyOn(rewardsService.rewardsRepository, "findOrCreateByImageId")
        .mockResolvedValue(mockRewardRecord);
      jest.spyOn(rewardsService.rewardsRepository, "update").mockResolvedValue({
        ...mockRewardRecord,
        total_points_awarded: points,
      });
      jest
        .spyOn(rewardsService.usersRepository, "getById")
        .mockResolvedValue(MOCK_REWARD_CREATOR_USER);
      jest
        .spyOn(rewardsService.usersRepository, "update")
        .mockResolvedValue({});
      const createTransactionSpy = jest
        .spyOn(rewardsService.rewardTransactionsRepository, "createTransaction")
        .mockResolvedValue({
          _id: new mongoose.Types.ObjectId(),
          image_id: imageId,
          user_id: userId,
          transaction_type: "BONUS",
          points_awarded: points,
        });

      const result = await rewardsService.awardBonusPoints(
        imageId,
        userId,
        points,
        reason,
        description
      );

      expect(result.transaction_type).toBe("BONUS");
      expect(result.points_awarded).toBe(points);

      // Verify rewards doc was updated
      expect(rewardsService.rewardsRepository.update).toHaveBeenCalledWith(
        mockRewardRecord._id,
        expect.objectContaining({
          $inc: { total_points_awarded: points },
        })
      );

      // Verify user was updated
      expect(rewardsService.usersRepository.update).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          reward_points_current: points,
          reward_points_lifetime: points,
        })
      );

      // Verify transaction was created
      expect(createTransactionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction_type: "BONUS",
          points_awarded: points,
        })
      );
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
      const updateByImageIdSpy = jest
        .spyOn(rewardsService.rewardsRepository, "updateByImageId")
        .mockResolvedValue({});

      const result = await rewardsService.reverseTransaction(
        transactionId,
        adminId,
        "Abuse detected"
      );

      expect(result.is_reversed).toBe(true);
      expect(result.points_awarded).toBeDefined();
      expect(result.points_awarded).toBe(
        MOCK_UNREVERSED_TRANSACTION.points_awarded
      );

      // MILESTONE_REWARD reversal should NOT update rewards doc
      expect(updateByImageIdSpy).not.toHaveBeenCalled();
    });

    it("should also decrement rewards doc when reversing a BONUS transaction", async () => {
      const adminId = new mongoose.Types.ObjectId();
      const imageId = new mongoose.Types.ObjectId();
      const bonusTransaction = {
        ...MOCK_UNREVERSED_TRANSACTION,
        transaction_type: "BONUS",
        image_id: imageId,
        points_awarded: 50,
      };
      const reversedBonusTransaction = {
        ...bonusTransaction,
        is_reversed: true,
        reversed_at: new Date(),
        reversal_reason: "Admin correction",
      };
      const transactionId = bonusTransaction._id;

      jest
        .spyOn(
          rewardsService.rewardTransactionsRepository,
          "getTransactionById"
        )
        .mockResolvedValue(bonusTransaction);
      jest
        .spyOn(
          rewardsService.rewardTransactionsRepository,
          "reverseTransaction"
        )
        .mockResolvedValue(reversedBonusTransaction);
      jest.spyOn(rewardsService.usersRepository, "getById").mockResolvedValue({
        ...MOCK_REWARD_CREATOR_USER,
        reward_points_current: 100,
      });
      jest
        .spyOn(rewardsService.usersRepository, "update")
        .mockResolvedValue({});
      jest
        .spyOn(rewardsService.rewardTransactionsRepository, "createTransaction")
        .mockResolvedValue({});
      const updateByImageIdSpy = jest
        .spyOn(rewardsService.rewardsRepository, "updateByImageId")
        .mockResolvedValue({});

      const result = await rewardsService.reverseTransaction(
        transactionId,
        adminId,
        "Admin correction"
      );

      expect(result.is_reversed).toBe(true);

      // BONUS reversal SHOULD update rewards doc
      expect(updateByImageIdSpy).toHaveBeenCalledWith(
        imageId,
        expect.objectContaining({
          $inc: { total_points_awarded: -50 },
        })
      );
    });
  });
});
