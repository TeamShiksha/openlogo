const { GuestUserRepository } = require("../repositories");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class GuestUserService {
  constructor() {
    this.guestUserRepository = new GuestUserRepository();
  }

  async handleGuestLogin(guestDetails) {
    let { ip, token } = guestDetails;
    console.log("Token: ", token);
    if (token) {
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const guest = await this.guestUserRepository.findUserByDeviceID(
          decodedToken.id
        );
        console.log("Guest: ", guest);
        if (guest) {
          return {
            status: 409,
            message: "Guest User already logged in",
            token,
          };
        }
      } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
          return {
            status: 403,
            message: "Token has expired. Please sign in again.",
          };
        }
        return { status: 400, message: "Invalid token" };
      }
    }
    const hashedDeviceID = await bcrypt.hash(
      ip,
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
        expiresIn: "2h",
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
