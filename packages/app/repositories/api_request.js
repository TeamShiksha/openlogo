const api_request = require("../models/api_request");
const BaseRepository = require("./base");
const dayjs = require("dayjs");
/**
 * The ApiRequestRepository extends BaseRepository to manage ApiRequest model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the ApiRequest model to the base repository for database interactions.
 *  Custom methods specific to ApiRequest can also be added as needed.
 */
class ApiRequestRepository extends BaseRepository {
  constructor() {
    super(api_request);
  }

  /**
   * Get current week data (Sunday to Saturday) for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  async getCurrentWeekData(userId) {
    const today = dayjs();
    const currentDayOfWeek = today.day();
    const weekStart = today.subtract(currentDayOfWeek, "day").startOf("day");
    const weekEnd = weekStart.add(6, "day").endOf("day");
    const weekStartDate = weekStart.toDate();
    const weekEndDate = weekEnd.toDate();

    const result = await this.model.aggregate([
      {
        $addFields: {
          createdDate: { $toDate: "$createdAt" },
        },
      },
      {
        $match: {
          user_id: userId,
          createdDate: {
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
              date: "$createdDate",
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
   * Get current month data for a specific user
   * @param {string} userId - The user ID to filter by
   * @returns {Promise<Object>} - An object containing the count of requests for each day
   */
  async getCurrentMonthData(userId) {
    const today = dayjs();
    const monthStart = today.startOf("month").toDate();
    const monthEnd = today.endOf("month").toDate();

    const result = await this.model.aggregate([
      {
        $addFields: {
          createdDate: { $toDate: "$createdAt" },
        },
      },
      {
        $match: {
          user_id: userId,
          createdDate: {
            $gte: monthStart,
            $lte: monthEnd,
          },
        },
      },
      {
        $addFields: {
          dateOnly: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdDate",
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
      startDate: dayjs(monthStart).format("YYYY-MM-DD"),
      endDate: dayjs(monthEnd).format("YYYY-MM-DD"),
      summary: summary,
      data: result,
    };
  }
}

module.exports = ApiRequestRepository;
