const BaseRepository = require("./base");
const User = require("../models/users");

/**
 * The UsersRepository extends BaseRepository to manage User model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the Users model to the base repository for database interactions.
 * Custom methods specific to Users can also be added as needed.
 */

class UsersRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Finds a user by email.
   * @param {string} emailId - The email address to search for.
   * @returns {Promise<Object|null>} - Returns the user document if found, otherwise null.
   */
  async findUserByEmail(email) {
    return await this.model.findOne({ email });
  }

  /**
   *
   * @returns {Promise<number>} - Total number of users.
   */
  async getUsersCount() {
    return await User.countDocuments({
      is_verified: true,
      is_deleted: false,
    });
  }
  /**
   *
   * @returns {Promise<Object|null>} - Returns the user document with role:GUEST if found, otherwise null.
   */
  async getGuestUser() {
    return await this.model.findOne({ role: "GUEST" });
  }

  /**
   * This return userId by subscriptionId
   * @param {string} subscriptionId - The subscription ID to search for.
   * @returns {Promise<Object|null>} - Returns the user document with only _id field if found, otherwise null.
   */
  async findUserBySubscriptionId(subscriptionId) {
    return await this.model
      .findOne({ subscription_id: subscriptionId })
      .select("_id")
      .lean();
  }
}

module.exports = UsersRepository;
