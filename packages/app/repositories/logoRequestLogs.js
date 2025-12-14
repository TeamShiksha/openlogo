const { LogoRequestLogs } = require("../models");
const BaseRepository = require("./base");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

/**
 * The LogoRequestLogsRepository extends BaseRepository to manage LogoRequestLogs model operations, inheriting CRUD methods like getById, getAll, create, update, and delete.
 * It passes the LogoRequestLogs model to the base repository for database interactions.
 * Custom methods specific to LogoRequestLogs can also be added as needed.
 */
class LogoRequestLogsRepository extends BaseRepository {
  constructor() {
    super(LogoRequestLogs);
  }

  /**
   * Generic method to get aggregated data for a date range
   * @param {string} userId - The user ID to filter by
   * @param {number} days - Number of days to look back
   * @param {string} period - Period label (e.g., 'week', 'month')
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  async getDataForPeriod(userId, days, period) {
    const today = dayjs();
    const startDate = today.subtract(days, "day").startOf("day");
    const endDate = today.endOf("day");

    const result = await this.model.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: startDate.toDate(),
            $lte: endDate.toDate(),
          },
        },
      },
      {
        $addFields: {
          dateOnly: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
        },
      },
      {
        $group: {
          _id: "$dateOnly",
          count: { $sum: 1 },
          totalBytes: { $sum: "$response_size_bytes" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          count: 1,
          totalKB: { $round: [{ $divide: ["$totalBytes", 1024] }, 2] },
        },
      },
    ]);

    const summary = {
      totalCount: result.reduce((sum, day) => sum + day.count, 0),
      totalKB: result.reduce((sum, day) => sum + day.totalKB, 0).toFixed(2),
    };

    return {
      period,
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
      summary,
      data: result,
    };
  }

  /**
   * Get last 7 days data for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  getCurrentWeekData(userId) {
    return this.getDataForPeriod(userId, 7, "week");
  }

  /**
   * Get last 30 days data for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  getCurrentMonthData(userId) {
    return this.getDataForPeriod(userId, 30, "month");
  }
}

module.exports = LogoRequestLogsRepository;
