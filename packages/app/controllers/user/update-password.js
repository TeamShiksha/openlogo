const bcrypt = require("bcrypt");
const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const { updatePasswordPayloadSchema } = require("../../schemas/user");

/**
 * This controller validates the current and new passwords from the request body,
 * verifies the user's identity, and updates the password if the current password
 * is correct.
 */
async function updatePasswordController(req, res, next) {
  try {
    const userService = new UserService();
    const { error, value } = updatePasswordPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { currPassword, newPassword } = value;
    const { email } = req.userData;
    const user = await userService.getUserByEmail(email);
    const matchPassword = await user.matchPassword(currPassword);
    if (!matchPassword) {
      return res.status(400).json({
        message: "Current password is incorrect",
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    const userUpdateSuccessful = await userService.updateUserPassword(
      user,
      hashNewPassword,
    );
    if (!userUpdateSuccessful) {
      return res.status(500).json({
        message: "Something went wrong. Try again later!",
        statusCode: 500,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = updatePasswordController;
