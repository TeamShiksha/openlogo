const BaseRepository = require("./base");
const GuestUser = require("../models/guestuser");
/**
 * The GuestUserRepository extends BaseRepository to manage User model operations, inheriting CRUD methods like getById, getAll, create, update, and delete..
 * It passes the GuestUser model to the base repository for database interactions.
 * Custom methods specific to Guest Users can also be added as needed.
 */

class GuestUserRepository extends BaseRepository {
  constructor() {
    super(GuestUser);
  }

  /**
   * Find a user by Device ID
   * @param {string} id - The device ID to search for
   */

  async findUserByDeviceID(hashedDeviceID) {
    const guest = await this.model.findOne({ deviceID: hashedDeviceID });
    return guest || null;
  }
  async deleteUserByDeviceID(hashedDeviceID) {
    const deletedGuest = await this.model.deleteOne({
      deviceID: hashedDeviceID,
    });
    return deletedGuest || null;
  }
}

module.exports = GuestUserRepository;
