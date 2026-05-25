const {
  RewardsRepository,
  UsersRepository,
  LogoRequestLogsRepository,
  ImagesRepository,
  RewardTransactionsRepository,
  MilestoneConfigRepository,
} = require("../repositories");

class RewardsService {
  constructor() {
    this.rewardsRepository = new RewardsRepository();
    this.usersRepository = new UsersRepository();
    this.logoRequestLogsRepository = new LogoRequestLogsRepository();
    this.imagesRepository = new ImagesRepository();
    this.rewardTransactionsRepository = new RewardTransactionsRepository();
    this.milestoneConfigRepository = new MilestoneConfigRepository();
  }

  /**
   * Calculates and issues rewards for a logo based on unique Pro user count
   * @param {string} imageId - The image ID to process
   * @returns {Promise<Object>} - Processing result with details
   */
  async processRewardsForImage(imageId) {
    try {
      const milestoneConfig = await this.milestoneConfigRepository.findActive();
      if (!milestoneConfig) {
        return {
          success: false,
          imageId,
          error: "No active MilestoneConfig found. Aborting.",
        };
      }

      const image = await this.imagesRepository.getById(imageId);
      if (!image) {
        return { success: false, error: "Image not found" };
      }

      const creatorId = image.user_id;

      const eligibleRequests = await this.logoRequestLogsRepository.find({
        image_id: imageId,
        is_reward_eligible: true,
      });

      const reward = await this.rewardsRepository.findOrCreateByImageId(
        imageId,
        creatorId
      );

      const existingUserIds = new Set(
        reward.unique_pro_users.map((uid) => uid.toString())
      );

      const newUsers = eligibleRequests
        .filter((req) => !existingUserIds.has(req.user_id.toString()))
        .map((req) => req.user_id);

      await this.imagesRepository.update(imageId, {
        has_pending_reward: false,
      });

      if (newUsers.length === 0) {
        return {
          success: true,
          imageId,
          creatorId,
          newUsersAdded: 0,
          newMilestones: [],
          totalPointsAwarded: 0,
          message: "No new users found",
        };
      }

      reward.unique_pro_users.push(...newUsers);
      const previousCount = reward.unique_pro_users_count || 0;
      const newCount = reward.unique_pro_users.length;

      const alreadyAchieved = new Set(
        reward.milestones_achieved.map((m) => m.milestone)
      );

      const newMilestones = milestoneConfig.thresholds
        .filter((t) => t.at <= newCount && !alreadyAchieved.has(t.at))
        .map((t) => ({
          milestone: t.at,
          achieved_at: new Date(),
          points_awarded: t.points,
        }));

      if (newMilestones.length === 0) {
        await this.rewardsRepository.update(reward._id, {
          unique_pro_users: reward.unique_pro_users,
          unique_pro_users_count: newCount,
          updated_at: new Date(),
        });

        return {
          success: true,
          imageId,
          creatorId,
          previousUniqueCount: previousCount,
          newUniqueCount: newCount,
          newUsersAdded: newUsers.length,
          newMilestones: [],
          totalPointsAwarded: 0,
          message: `Added ${newUsers.length} new users, no milestones reached`,
        };
      }

      const totalNewPoints = newMilestones.reduce(
        (sum, m) => sum + m.points_awarded,
        0
      );
      const previousTotal = reward.total_points_awarded || 0;
      const newTotal = previousTotal + totalNewPoints;

      await this.rewardsRepository.update(reward._id, {
        unique_pro_users: reward.unique_pro_users,
        unique_pro_users_count: newCount,
        milestones_achieved: [...reward.milestones_achieved, ...newMilestones],
        total_points_awarded: newTotal,
        updated_at: new Date(),
      });

      const creator = await this.usersRepository.getById(creatorId);
      const newPointsCurrent =
        (creator.reward_points_current || 0) + totalNewPoints;
      const newPointsLifetime =
        (creator.reward_points_lifetime || 0) + totalNewPoints;

      await this.usersRepository.update(creatorId, {
        reward_points_current: newPointsCurrent,
        reward_points_lifetime: newPointsLifetime,
        updated_at: new Date(),
      });

      const transactions = newMilestones.map((milestone, index) => ({
        image_id: imageId,
        user_id: creatorId,
        transaction_type: "MILESTONE_REWARD",
        milestone: milestone.milestone,
        points_awarded: milestone.points_awarded,
        description: `Milestone ${milestone.milestone} reached - ${milestone.milestone} unique Pro users`,
        reason: "NORMAL_MILESTONE",
        previous_total:
          previousTotal +
          (index > 0
            ? newMilestones
                .slice(0, index)
                .reduce((sum, m) => sum + m.points_awarded, 0)
            : 0),
        new_total:
          previousTotal +
          newMilestones
            .slice(0, index + 1)
            .reduce((sum, m) => sum + m.points_awarded, 0),
        is_reversed: false,
        metadata: {
          unique_pro_users_count: newCount,
          processed_at: new Date(),
        },
      }));

      Promise.all(
        transactions.map((t) =>
          this.rewardTransactionsRepository.createTransaction(t)
        )
      ).catch((err) =>
        console.error("Failed to create reward transactions:", err.message)
      );

      return {
        success: true,
        imageId,
        creatorId,
        previousUniqueCount: previousCount,
        newUniqueCount: newCount,
        newUsersAdded: newUsers.length,
        newMilestones: newMilestones,
        totalPointsAwarded: totalNewPoints,
      };
    } catch (error) {
      console.error(
        `[RewardsService] Error processing rewards for image ${imageId}:`,
        error
      );
      return {
        success: false,
        imageId,
        error: error.message,
      };
    }
  }

  /**
   * Retrieves reward summary for an image
   * @param {string} imageId - The image ID
   * @returns {Promise<Object>} - Reward summary
   */
  async getRewardSummaryForImage(imageId) {
    try {
      const reward = await this.rewardsRepository.findByImageId(imageId);

      if (!reward) {
        return {
          imageId,
          uniqueProUsersCount: 0,
          milestonesAchieved: [],
          totalPointsAwarded: 0,
        };
      }

      const image = await this.imagesRepository.getById(imageId);
      const creator = await this.usersRepository.getById(reward.user_id);

      // Determine next milestone from the active config
      const milestoneConfig = await this.milestoneConfigRepository.findActive();
      let nextMilestone = null;
      if (milestoneConfig) {
        const currentCount = reward.unique_pro_users.length;
        const next = milestoneConfig.thresholds
          .filter((t) => t.at > currentCount)
          .sort((a, b) => a.at - b.at)[0];
        nextMilestone = next ? next.at : null;
      }

      return {
        imageId: imageId,
        imageName: image?.company_name || "Unknown",
        creator: {
          id: creator?._id,
          name: creator?.name,
          email: creator?.email,
        },
        uniqueProUsersCount: reward.unique_pro_users.length,
        uniqueProUsers: reward.unique_pro_users,
        totalPointsAwarded: reward.total_points_awarded,
        milestonesAchieved: reward.milestones_achieved,
        nextMilestone,
      };
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving reward summary for image ${imageId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Retrieves user's total reward points and reward history
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - User reward data
   */
  async getUserRewardData(userId) {
    try {
      const user = await this.usersRepository.getById(userId);
      if (!user) {
        return null;
      }

      const rewards = await this.rewardsRepository.findByUserId(userId);

      const totalPointsAwarded = rewards.reduce(
        (sum, r) => sum + (r.total_points_awarded || 0),
        0
      );

      return {
        userId,
        userName: user.name,
        email: user.email,
        currentPoints: user.reward_points_current || 0,
        lifetimePoints: user.reward_points_lifetime || 0,
        totalImages: rewards.length,
        totalPointsAwarded: totalPointsAwarded,
        averagePointsPerImage:
          rewards.length > 0
            ? Math.round(totalPointsAwarded / rewards.length)
            : 0,
        rewards: rewards.map((r) => ({
          imageId: r.image_id,
          uniqueProUsersCount: r.unique_pro_users.length,
          totalPointsAwarded: r.total_points_awarded,
          milestonesAchieved: r.milestones_achieved.length,
        })),
      };
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving reward data for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets leaderboard of top creators by reward points
   * @param {number} limit - Number of top creators to return
   * @returns {Promise<Array>} - Top creators list
   */
  async getRewardsLeaderboard(limit = 10) {
    try {
      const topCreators = await this.rewardsRepository.getPaginatedRewards(
        1,
        limit
      );

      return topCreators.data.map((reward, index) => ({
        rank: index + 1,
        userId: reward.user_id._id || reward.user_id,
        name: reward.user_id.name || "Unknown",
        email: reward.user_id.email || "Unknown",
        uniqueProUsersCount: reward.unique_pro_users.length,
        totalPointsAwarded: reward.total_points_awarded,
        milestonesAchieved: reward.milestones_achieved.length,
      }));
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving rewards leaderboard:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets transaction history for an image
   * @param {string} imageId - The image ID
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} - Paginated transactions
   */
  async getImageTransactions(imageId, page = 1, limit = 20) {
    try {
      return await this.rewardTransactionsRepository.getTransactionsByImageId(
        imageId,
        page,
        limit
      );
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving transactions for image ${imageId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets transaction history for a user (creator)
   * @param {string} userId - The user ID
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} - Paginated transactions
   */
  async getUserTransactions(userId, page = 1, limit = 20) {
    try {
      return await this.rewardTransactionsRepository.getTransactionsByUserId(
        userId,
        page,
        limit
      );
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving transactions for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets a specific transaction
   * @param {string} transactionId - The transaction ID
   * @returns {Promise<Object>} - Transaction details
   */
  async getTransaction(transactionId) {
    try {
      return await this.rewardTransactionsRepository.getTransactionById(
        transactionId
      );
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving transaction ${transactionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Manually awards bonus points to a user
   * @param {string} imageId - The image ID
   * @param {string} userId - The creator's user ID
   * @param {number} points - Points to award
   * @param {string} reason - Reason for bonus
   * @param {string} description - Description
   * @returns {Promise<Object>} - Transaction details
   */
  async awardBonusPoints(imageId, userId, points, reason, description) {
    try {
      const user = await this.usersRepository.getById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const previousTotal = user.reward_points_current || 0;
      const newTotal = previousTotal + points;

      // Update user points
      await this.usersRepository.update(userId, {
        reward_points_current: newTotal,
        reward_points_lifetime: (user.reward_points_lifetime || 0) + points,
        updated_at: new Date(),
      });

      // Create transaction record
      const transaction =
        await this.rewardTransactionsRepository.createTransaction({
          image_id: imageId,
          user_id: userId,
          transaction_type: "BONUS",
          points_awarded: points,
          description: description || `Bonus award: ${reason}`,
          reason: reason || "PROMOTION",
          previous_total: previousTotal,
          new_total: newTotal,
          is_reversed: false,
          metadata: {
            awarded_at: new Date(),
          },
        });

      return transaction;
    } catch (error) {
      console.error(`[RewardsService] Error awarding bonus points:`, error);
      throw error;
    }
  }

  /**
   * Reverses a reward transaction
   * @param {string} transactionId - The transaction to reverse
   * @param {string} reversedBy - User ID of who is reversing
   * @param {string} reason - Reason for reversal
   * @returns {Promise<Object>} - Reversal details
   */
  async reverseTransaction(transactionId, reversedBy, reason) {
    try {
      const transaction =
        await this.rewardTransactionsRepository.getTransactionById(
          transactionId
        );

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.is_reversed) {
        throw new Error("Transaction already reversed");
      }

      // Reverse the transaction
      const reversedTransaction =
        await this.rewardTransactionsRepository.reverseTransaction(
          transactionId,
          reversedBy,
          reason
        );

      // Update user's points
      const user = await this.usersRepository.getById(transaction.user_id);
      const newPointsCurrent =
        (user.reward_points_current || 0) - transaction.points_awarded;

      await this.usersRepository.update(transaction.user_id, {
        reward_points_current: Math.max(0, newPointsCurrent),
        updated_at: new Date(),
      });

      // Create a reversal transaction record
      await this.rewardTransactionsRepository.createTransaction({
        image_id: transaction.image_id,
        user_id: transaction.user_id,
        transaction_type: "REVERSAL",
        points_awarded: 0,
        points_reversed: transaction.points_awarded,
        description: `Reversal of transaction ${transactionId}: ${reason}`,
        reason: "SYSTEM_ERROR",
        previous_total: user.reward_points_current || 0,
        new_total: Math.max(0, newPointsCurrent),
        is_reversed: false,
        metadata: {
          reversed_transaction_id: transactionId,
          reversed_at: new Date(),
          reversed_by: reversedBy,
        },
      });

      return reversedTransaction;
    } catch (error) {
      console.error(
        `[RewardsService] Error reversing transaction ${transactionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets transaction statistics for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Transaction statistics
   */
  async getUserTransactionStats(userId) {
    try {
      return await this.rewardTransactionsRepository.getUserTransactionStats(
        userId
      );
    } catch (error) {
      console.error(
        `[RewardsService] Error retrieving transaction stats for user ${userId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Gets audit trail for reward history
   * @param {string} imageId - The image ID
   * @param {string} userId - The creator's user ID
   * @returns {Promise<Array>} - Audit trail
   */
  async getAuditTrail(imageId, userId) {
    try {
      return await this.rewardTransactionsRepository.getAuditTrail(
        imageId,
        userId
      );
    } catch (error) {
      console.error(`[RewardsService] Error retrieving audit trail:`, error);
      throw error;
    }
  }

  /**
   * Searches transactions with filters
   * @param {Object} filters - Search filters
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} - Filtered results
   */
  async searchTransactions(filters, page = 1, limit = 20) {
    try {
      return await this.rewardTransactionsRepository.searchTransactions(
        filters,
        page,
        limit
      );
    } catch (error) {
      console.error(`[RewardsService] Error searching transactions:`, error);
      throw error;
    }
  }
}

module.exports = RewardsService;
