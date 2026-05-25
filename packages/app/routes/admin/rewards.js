const router = require("express").Router();
const {
  processBatchRewardsController,
  getPendingRewardsController,
  processSpecificImageRewardController,
  getRewardsHealthController,
} = require("../../controllers/rewards");

/**
 * Middleware to validate reward processor token
 * Protects the batch processing endpoint from unauthorized access
 */
function validateProcessorToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Missing or invalid authorization header",
      statusCode: 401,
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const expectedToken = process.env.REWARD_PROCESSOR_TOKEN;

  if (!expectedToken) {
    console.error("REWARD_PROCESSOR_TOKEN environment variable is not set");
    return res.status(500).json({
      success: false,
      error: "Server configuration error",
      statusCode: 500,
    });
  }

  if (token !== expectedToken) {
    return res.status(403).json({
      success: false,
      error: "Invalid token",
      statusCode: 403,
    });
  }

  next();
}

/**
 * POST /api/admin/rewards/process-batch
 * Processes all pending reward-eligible logo requests in batch
 * - Fetches and processes all images with pending rewards
 * - Returns summary with success/failure counts and statistics
 * - Requires: Bearer token via REWARD_PROCESSOR_TOKEN env variable
 */
router.post(
  "/process-batch",
  validateProcessorToken,
  processBatchRewardsController
);

/**
 * GET /api/admin/rewards/pending
 * Retrieves images with pending rewards without processing them
 * - Useful for monitoring and debugging reward status
 * - Requires: Bearer token via REWARD_PROCESSOR_TOKEN env variable
 */
router.get("/pending", validateProcessorToken, getPendingRewardsController);

/**
 * POST /api/admin/rewards/process-image/:imageId
 * Manually processes rewards for a specific image
 * - Useful for testing and manual corrections
 * - Requires: Bearer token via REWARD_PROCESSOR_TOKEN env variable
 */
router.post(
  "/process-image/:imageId",
  validateProcessorToken,
  processSpecificImageRewardController
);

/**
 * GET /api/admin/rewards/health
 * Health check endpoint to verify reward processor status
 * - Returns healthy status and timestamp
 * - Requires: Bearer token via REWARD_PROCESSOR_TOKEN env variable
 */
router.get("/health", validateProcessorToken, getRewardsHealthController);

module.exports = router;
