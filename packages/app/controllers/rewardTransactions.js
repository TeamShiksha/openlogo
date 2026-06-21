const RewardTrackingService = require("../services/rewardTransactions");
const { RewardMessages } = require("../utils/constants");

/**
 * RewardTransactions Controller
 * Handles validation and logging of logo requests for reward eligibility
 */

/**
 * Validate and log a logo request for reward eligibility
 * POST /api/rewards/validate-request
 */
async function validateAndLogRequestController(req, res, next) {
  try {
    const { imageId, userId, creatorId, keyId, subscription } = req.body;

    if (!imageId || !userId || !creatorId || !keyId || !subscription) {
      return res.status(422).json({
        success: false,
        error: RewardMessages.MISSING_REQUEST_FIELDS,
        statusCode: 422,
      });
    }

    const rewardTrackingService = new RewardTrackingService();

    const validation = rewardTrackingService.validateRequestParams({
      imageId,
      userId,
      creatorId,
      keyId,
      subscriptionId: subscription._id,
      subscription,
    });

    if (!validation.isValid) {
      return res.status(422).json({
        success: false,
        error: validation.errors.join(", "),
        statusCode: 422,
      });
    }

    const logEntry = await rewardTrackingService.validateAndLogRequest({
      imageId,
      userId,
      creatorId,
      keyId,
      subscription,
    });

    return res.status(200).json({
      success: true,
      data: logEntry,
      message: `${RewardMessages.REQUEST_LOGGED}: ${logEntry.is_reward_eligible ? "ELIGIBLE" : "INELIGIBLE"}`,
      statusCode: 200,
    });
  } catch (error) {
    console.error(
      "[RewardTransactionsController] Error validating request:",
      error
    );
    next(error);
  }
}

/**
 * Get reward eligibility reasons (constants)
 * GET /api/rewards/eligibility-reasons
 */
function getEligibilityReasonsController(req, res, next) {
  try {
    const reasons = {
      VALID: "User is eligible for rewards",
      HOBBY_USER: "Only Pro plan users are eligible",
      SELF_USAGE: "Creators cannot earn from their own logos",
      DUPLICATE_USAGE: "User has already requested this logo",
    };

    return res.status(200).json({
      success: true,
      data: reasons,
      statusCode: 200,
    });
  } catch (error) {
    console.error(
      "[RewardTransactionsController] Error getting eligibility reasons:",
      error
    );
    next(error);
  }
}

module.exports = {
  validateAndLogRequestController,
  getEligibilityReasonsController,
};
