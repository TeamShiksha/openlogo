const Joi = require("joi");
const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const { addAdminSchema } = require("../../schemas/admin");

/**
 * Promotes a user to admin or operator role using their email.
 * Validates email input and updates user role if the user exists.
 */
const addAdminController = async (req, res, next) => {
  try {
    const userService = new UserService();
    const email = req.body.email;
    const { error } = addAdminSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.message,
        error: STATUS_CODES[422],
      });
    }

    const response = await userService.updateUserToAdmin(email);
    if (!response) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = addAdminController;
