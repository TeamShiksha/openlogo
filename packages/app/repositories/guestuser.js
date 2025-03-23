const BaseRepository = require("./base");
const { GuestUsers } = require("../models");
/**
 * The GuestUserRepository extends BaseRepository to manage User model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the GuestUser model to the base repository for database interactions.
 * Custom methods specific to Guest Users can also be added as needed.
 */

class GuestUserRepository extends BaseRepository {
  constructor() {
    super(GuestUsers);
  }

  /**
   * Find a user by Device ID
   * @param {string} id - The device ID to search for
   */
  async findUserByDeviceID(deviceId) {
    const guest = await this.model.findOne({ deviceID: deviceId });
    return guest || null;
  }
  async deleteUserByDeviceID(deviceId) {
    const deletedGuest = await this.model.deleteOne({
      deviceID: deviceId,
    });
    return deletedGuest || null;
  }
}

module.exports = GuestUserRepository;
