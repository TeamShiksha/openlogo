const { STATUS_CODES } = require("http");
const { RewardsService } = require("../services");
const { Messages } = require("../utils/constants");

/**
 * Retrieves reward summary for a specific image
 * - Returns reward details associated with an image
 */
async function getRewardSummaryForImageController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { imageId } = req.params;

    const summary = await rewardsService.getRewardSummaryForImage(imageId);
    if (!summary) {
      return res.status(404).json({
        message: "No reward data found for this image",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves reward summary for the authenticated user (creator)
 * - Returns total points, rewards earned, and reward statistics
 * - Requires: authentication
 */
async function getRewardSummaryForUserController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const userId = req.userData.userId; // From auth middleware

    const summary = await rewardsService.getUserRewardData(userId);
    if (!summary) {
      return res.status(404).json({
        message: Messages.USER_NOT_FOUND,
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: summary,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves leaderboard of top creators ranked by reward points
 * - Query params: limit (default: 10)
 */
async function getRewardsLeaderboardController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const limit = parseInt(req.query.limit) || 10;

    const leaderboard = await rewardsService.getRewardsLeaderboard(limit);

    return res.status(200).json({
      statusCode: 200,
      data: leaderboard,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves transaction history for a specific image
 * - Query params: page (default: 1), limit (default: 20)
 */
async function getImageTransactionsController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { imageId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const transactions = await rewardsService.getImageTransactions(
      imageId,
      page,
      limit
    );

    return res.status(200).json({
      statusCode: 200,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves transaction history for the authenticated user
 * - Query params: page (default: 1), limit (default: 20)
 * - Requires: authentication
 */
async function getUserTransactionsController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const userId = req.userData.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const transactions = await rewardsService.getUserTransactions(
      userId,
      page,
      limit
    );

    return res.status(200).json({
      statusCode: 200,
      data: transactions,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves details of a specific transaction by ID
 */
async function getTransactionController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { transactionId } = req.params;

    const transaction = await rewardsService.getTransaction(transactionId);

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: transaction,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves transaction statistics for the authenticated user
 * - Returns aggregated data like total points, transaction counts, etc.
 * - Requires: authentication
 */
async function getUserTransactionStatsController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const userId = req.userData.userId;

    const stats = await rewardsService.getUserTransactionStats(userId);

    return res.status(200).json({
      statusCode: 200,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves audit trail for a specific image
 * - Shows reward-related changes and history for the image
 * - Requires: authentication
 */
async function getAuditTrailController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { imageId } = req.params;
    const userId = req.userData.userId;

    const auditTrail = await rewardsService.getAuditTrail(imageId, userId);

    return res.status(200).json({
      statusCode: 200,
      data: auditTrail,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Searches transactions with multiple filter options
 * - Query params: userId, imageId, type, isReversed, reason, startDate, endDate, page, limit
 * - Requires: authentication, admin role
 */
async function searchTransactionsController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const filters = {
      userId: req.query.userId || null,
      imageId: req.query.imageId || null,
      transactionType: req.query.type || null,
      isReversed: req.query.isReversed
        ? req.query.isReversed === "true"
        : undefined,
      reason: req.query.reason || null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Remove null filters
    Object.keys(filters).forEach(
      (key) => filters[key] === null && delete filters[key]
    );

    const results = await rewardsService.searchTransactions(
      filters,
      page,
      limit
    );

    return res.status(200).json({
      statusCode: 200,
      data: results,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Awards bonus reward points to a user for a specific image
 * - Body: { imageId, userId, points, reason, description }
 * - Requires: authentication, admin role
 */
async function awardBonusPointsController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { imageId, userId, points, reason, description } = req.body;

    // Validation
    if (!imageId || !userId || !points) {
      return res.status(400).json({
        message: "Missing required fields: imageId, userId, points",
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    if (points <= 0) {
      return res.status(400).json({
        message: "Points must be greater than 0",
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const transaction = await rewardsService.awardBonusPoints(
      imageId,
      userId,
      points,
      reason,
      description
    );

    return res.status(201).json({
      statusCode: 201,
      data: transaction,
      message: "Bonus points awarded successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Reverses/undoes a specific reward transaction
 * - Body: { reason }
 * - Requires: authentication, admin role
 */
async function reverseTransactionController(req, res, next) {
  try {
    const rewardsService = new RewardsService();
    const { transactionId } = req.params;
    const { reason } = req.body;
    const reversedBy = req.userData.userId;

    if (!reason) {
      return res.status(400).json({
        message: "Reversal reason is required",
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const reversedTransaction = await rewardsService.reverseTransaction(
      transactionId,
      reversedBy,
      reason
    );

    return res.status(200).json({
      statusCode: 200,
      data: reversedTransaction,
      message: "Transaction reversed successfully",
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Processes all pending reward-eligible logo requests
 * - Fetches images with pending rewards
 * - Processes rewards for each image
 * - Returns summary with success/failure counts and points awarded
 */
async function processBatchRewardsController(req, res) {
  const startTime = Date.now();

  try {
    console.log("[RewardBatch] Starting batch reward processing...");

    const rewardsService = new RewardsService();
    const { ImagesRepository } = require("../repositories");

    const pendingImages = await ImagesRepository.find({
      has_pending_reward: true,
    });

    console.log(
      `[RewardBatch] Found ${pendingImages.length} image(s) with pending rewards`
    );

    if (pendingImages.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No pending rewards to process",
        processedImages: 0,
        results: [],
        executionTime: `${Date.now() - startTime}ms`,
        timestamp: new Date(),
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;
    let totalPointsAwarded = 0;

    for (const image of pendingImages) {
      const imageIdStr = image._id.toString();
      try {
        const result = await rewardsService.processRewardsForImage(image._id);
        results.push(result);

        if (result.success) {
          successCount++;
          totalPointsAwarded += result.totalPointsAwarded || 0;
          console.log(
            `[RewardBatch] ✓ Processed image ${imageIdStr}: +${result.totalPointsAwarded} points`
          );
        } else {
          failureCount++;
          console.error(
            `[RewardBatch] ✗ Failed to process image ${imageIdStr}: ${result.error}`
          );
        }
      } catch (error) {
        failureCount++;
        results.push({
          success: false,
          imageId: imageIdStr,
          error: error.message,
        });
        console.error(
          `[RewardBatch] ✗ Error processing image ${imageIdStr}:`,
          error
        );
      }
    }

    const executionTime = Date.now() - startTime;

    const response = {
      success: true,
      summary: {
        processedImages: pendingImages.length,
        successCount,
        failureCount,
        totalPointsAwarded,
      },
      results,
      executionTime: `${executionTime}ms`,
      timestamp: new Date(),
    };

    console.log(
      `[RewardBatch] ✓ Batch processing completed in ${executionTime}ms`
    );
    console.log(`[RewardBatch] Summary:`, response.summary);

    return res.status(200).json(response);
  } catch (error) {
    console.error("[RewardBatch] Batch processing error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
      statusCode: 500,
      executionTime: `${Date.now() - startTime}ms`,
      timestamp: new Date(),
    });
  }
}

/**
 * Retrieves all images with pending rewards without processing them
 * - Returns count and details of pending images
 * - Useful for monitoring and debugging
 */
async function getPendingRewardsController(req, res, next) {
  try {
    const { ImagesRepository } = require("../repositories");

    const pendingImages = await ImagesRepository.find({
      has_pending_reward: true,
    });

    return res.status(200).json({
      success: true,
      pendingImages: pendingImages.length,
      images: pendingImages.map((img) => ({
        imageId: img._id.toString(),
        company_name: img.company_name,
      })),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("[RewardBatch] Error fetching pending rewards:", error);
    next(error);
  }
}

/**
 * Processes rewards for a specific image manually
 * - Triggers manual reward processing for a single image
 * - Useful for testing and manual corrections
 */
async function processSpecificImageRewardController(req, res, next) {
  try {
    const { imageId } = req.params;
    const rewardsService = new RewardsService();

    console.log(`[RewardBatch] Manual trigger: Processing image ${imageId}`);

    const result = await rewardsService.processRewardsForImage(imageId);

    if (result.success) {
      console.log(
        `[RewardBatch] ✓ Manually processed image ${imageId}: +${result.totalPointsAwarded} points`
      );
    } else {
      console.error(
        `[RewardBatch] ✗ Failed to process image ${imageId}: ${result.error}`
      );
    }

    const statusCode = result.success ? 200 : 400;
    return res.status(statusCode).json({
      success: result.success,
      data: result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error(`[RewardBatch] Error processing image:`, error);
    next(error);
  }
}

/**
 * Health check endpoint for the rewards processor
 * - Returns healthy status and timestamp
 */
function getRewardsHealthController(req, res) {
  return res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date(),
  });
}

module.exports = {
  getRewardSummaryForImageController,
  getRewardSummaryForUserController,
  getRewardsLeaderboardController,
  getImageTransactionsController,
  getUserTransactionsController,
  getTransactionController,
  getUserTransactionStatsController,
  getAuditTrailController,
  searchTransactionsController,
  awardBonusPointsController,
  reverseTransactionController,
  processBatchRewardsController,
  getPendingRewardsController,
  processSpecificImageRewardController,
  getRewardsHealthController,
};
