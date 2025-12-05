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
   * Get last 7 days data for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  async getCurrentWeekData(userId) {
    const today = dayjs();
    const weekStart = today.subtract(7, "day").startOf("day");
    const weekEnd = today.endOf("day");
    const weekStartDate = weekStart.toDate();
    const weekEndDate = weekEnd.toDate();

    const result = await this.model.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: weekStartDate,
            $lte: weekEndDate,
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
      period: "week",
      startDate: weekStart.format("YYYY-MM-DD"),
      endDate: weekEnd.format("YYYY-MM-DD"),
      summary: summary,
      data: result,
    };
  }

  /**
   * Get last 30 days data for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  async getCurrentMonthData(userId) {
    const today = dayjs();
    const monthStart = today.subtract(30, "day").startOf("day");
    const monthEnd = today.endOf("day");
    const monthStartDate = monthStart.toDate();
    const monthEndDate = monthEnd.toDate();

    const result = await this.model.aggregate([
      {
        $match: {
          user_id: new mongoose.Types.ObjectId(userId),
          createdAt: {
            $gte: monthStartDate,
            $lte: monthEndDate,
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
      period: "month",
      startDate: monthStart.format("YYYY-MM-DD"),
      endDate: monthEnd.format("YYYY-MM-DD"),
      summary: summary,
      data: result,
    };
  }
}

module.exports = LogoRequestLogsRepository;
