const BaseRepository = require("./base");
const Rewards = require("../models/rewards");

class RewardsRepository extends BaseRepository {
  constructor() {
    super(Rewards);
  }

  /**
   * Find or create a reward record for an image
   * @param {string} imageId - The image ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - The reward record
   */
  async findOrCreateByImageId(imageId, userId) {
    let reward = await this.model.findOne({ image_id: imageId });
    if (!reward) {
      reward = await this.create({
        image_id: imageId,
        user_id: userId,
        unique_pro_users: [],
      });
    }
    return reward;
  }

  /**
   * Get reward by image ID
   * @param {string} imageId - The image ID
   * @returns {Promise<Object|null>} - The reward record or null
   */
  async findByImageId(imageId) {
    return await this.model.findOne({ image_id: imageId });
  }

  /**
   * Add a unique Pro user to the reward tracking
   * @param {string} imageId - The image ID
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Updated reward record
   */
  async addUniqueProUser(imageId, userId) {
    return await this.model.findOneAndUpdate(
      { image_id: imageId },
      {
        $addToSet: {
          unique_pro_users: userId,
        },
        updated_at: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Record a milestone achievement
   * @param {string} imageId - The image ID
   * @param {number} milestone - The milestone number
   * @param {number} points - Points awarded
   * @returns {Promise<Object>} - Updated reward record
   */
  async recordMilestone(imageId, milestone, points) {
    return await this.model.findOneAndUpdate(
      { image_id: imageId },
      {
        $push: {
          milestones_achieved: {
            milestone,
            achieved_at: new Date(),
            points_awarded: points,
          },
        },
        $inc: { total_points_awarded: points },
        updated_at: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Check if a milestone has been achieved
   * @param {string} imageId - The image ID
   * @param {number} milestone - The milestone number
   * @returns {Promise<boolean>}
   */
  async isMilestoneAchieved(imageId, milestone) {
    const reward = await this.findByImageId(imageId);
    if (!reward) return false;
    return reward.milestones_achieved.some((m) => m.milestone === milestone);
  }

  /**
   * Get all rewards for a user's images
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - Array of reward records
   */
  async findByUserId(userId) {
    return await this.model.find({ user_id: userId });
  }

  /**
   * Get rewards with pagination and sorting
   * @param {number} page - Page number
   * @param {number} limit - Results per page
   * @returns {Promise<Object>} - Paginated results
   */
  async getPaginatedRewards(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const total = await this.model.countDocuments();
    const data = await this.model
      .find()
      .sort({ total_points_awarded: -1, updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "name email")
      .populate("image_id", "company_name");
    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = RewardsRepository;
