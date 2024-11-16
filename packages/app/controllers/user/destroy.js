const Joi = require("joi");
const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const { isValidObjectId } = require("mongoose");

const destroyKeyPayloadSchema = Joi.object({
  keyId: Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error("any.invalid");
    }
    return value;
  }).required().messages({
    "any.invalid": "Key ID must be a valid mongodb objectId",
    "any.required": "Key ID is required",
  }),
});

async function destroyKeyController(req, res, next) { 
  try {
    const userService = new UserService();
    const { error, value } = destroyKeyPayloadSchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    const { keyId } = value;
    const destroyedKey = await userService.destroyUserKey(keyId, user);
    if (!destroyedKey) {
      return res.status(404).json({
        message: "Invalid Key",
        statusCode: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,       
    });
  } catch (err) {
    next(err);
  }
}

module.exports = destroyKeyController;