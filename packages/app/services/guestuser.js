const { GuestUserRepository } = require("../repositories");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class GuestUserService {
  constructor() {
    this.guestUserRepository = new GuestUserRepository();
  }

  /**
   * Delete a guest user
   * @param {string} id - The device id to delete
   * @returns {boolean} - true if user was successfully deleted.
   */
  async handleGuestLogin(rawDeviceID, token) {
    console.log(token);
    if (token) {
      console.log(token);
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token: ", decodedToken);
        const guest = await this.guestUserRepository.findUserByDeviceID(
          decodedToken.id
        );
        if (guest) {
          return { message: "Guest User already logged in", token };
        }
      } catch (error) {
        console.log("Invalid or expired JWT, creating a new guest session.");
        return { message: error };
      }
    }
    const hashedDeviceID = await bcrypt.hash(
      rawDeviceID,
      parseInt(process.env.SALT_ROUND)
    );
    let guest = await this.guestUserRepository.create({
      deviceID: hashedDeviceID,
    });
    console.log("Guest: ", guest);
    token = jwt.sign(
      { id: guest.deviceID, role: guest.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "15min",
      }
    );
    return { message: "Guest Signed In", token };
  }

  async deleteUserAccount(id) {
    const deletedUser = await this.guestUserRepository.deleteUserByDeviceID(id);
    return deletedUser;
  }
}

module.exports = GuestUserService;
