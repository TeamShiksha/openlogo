const { GuestUserRepository } = require("../repositories");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class GuestUserService {
  constructor() {
    this.guestUserRepository = new GuestUserRepository();
  }

  async handleGuestLogin(guestDetails) {
    let { ip, token } = guestDetails;
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const guest = await this.guestUserRepository.findUserByDeviceID(
          decodedToken.id
        );
        return guest;
      } catch (error) {
        console.log(error);
        return error;
      }
    }
    const hashedDeviceID = await bcrypt.hash(
      ip,
      parseInt(process.env.SALT_ROUND)
    );
    let guest = await this.guestUserRepository.create({
      deviceID: hashedDeviceID,
    });
    token = jwt.sign(
      { id: guest.deviceID, role: guest.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );
    return token;
  }

  async deleteAccountById(id) {
    const deletedUser = await this.guestUserRepository.deleteUserByDeviceID(id);
    return deletedUser;
  }
}

module.exports = GuestUserService;
