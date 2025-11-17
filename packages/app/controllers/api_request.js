const { STATUS_CODES } = require("http");
const ApiRequestService = require("../services/api_request");
const { getStatsQuerySchema } = require("../schemas/api_request");
const { Messages } = require("../utils/constants");

/**
 * This controller fetches API request statistics for the authenticated user
 * based on the query parameter 'period' (week or month).
 * It validates the query parameter and returns the corresponding statistics.
 */
async function getApiStatsController(req, res, next) {
  try {
    const apiRequestService = new ApiRequestService();

    // Validate query parameters
    const { error } = getStatsQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.message,
        error: STATUS_CODES[422],
      });
    }

    const { userId } = req.userData;
    const { period } = req.query;

    let stats;

    // Get stats based on period
    if (period === "week") {
      stats = await apiRequestService.getWeeklyStats(userId);
    } else if (period === "month") {
      stats = await apiRequestService.getMonthlyStats(userId);
    }

    if (!stats) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.DATA_NOT_FOUND,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: stats,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getApiStatsController,
};
