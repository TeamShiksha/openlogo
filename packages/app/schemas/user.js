const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const destroyKeyPayloadSchema = Joi.object({
  keyId: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Key ID must be a valid mongodb objectId",
      "any.required": "Key ID is required",
    }),
});

const generateKeyPayloadSchema = Joi.object().keys({
  key_description: Joi.string()
    .trim()
    .required()
    .max(20)
    .regex(/^[a-zA-Z\s]*$/)
    .messages({
      "string.base": "Description must be a string",
      "any.required": "Description is required",
      "string.max": "Description must be 20 characters or fewer",
      "string.pattern.base":
        "Description must contain only alphabets and spaces",
    }),
});

const postRaiseRequestPayloadSchema = Joi.object({
  user_id: Joi.string().trim().required().hex().length(24).messages({
    "any.required": "User ID is required",
    "string.length": "User ID must be exactly 24 characters long",
    "string.hex": "User ID must be a valid hexadecimal string",
  }),
  companyUrl: Joi.string()
    .trim()
    .required()
    .regex(
      /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/.*)?$/,
    )
    .messages({
      "any.required": "URL is required",
      "string.pattern.base": "Invalid URL",
    }),
});

const updatePasswordPayloadSchema = Joi.object().keys({
  currPassword: Joi.string().trim().required().messages({
    "any.required": "Current password is required",
  }),
  newPassword: Joi.string().trim().required().min(8).max(30).messages({
    "string.base": "New password must be string",
    "string.min": "New password must be at least 8 characters",
    "string.max": "New password must be 30 characters or fewer",
    "any.required": "New password is required",
  }),
});

const changeNameEmailSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(20)
    .regex(/^[^!@#$%^&*(){}\[\]\\\.;'",.<>/?`~|0-9]*$/)
    .messages({
      "string.base": "First name must be string",
      "string.min": "First name cannot be empty",
      "string.max": "First name length must be 20 or fewer",
      "any.required": "First name is required",
      "string.pattern.base": "First name should only contain alphabets",
    }),
});

module.exports = {
  updatePasswordPayloadSchema,
  postRaiseRequestPayloadSchema,
  destroyKeyPayloadSchema,
  generateKeyPayloadSchema,
  changeNameEmailSchema,
};
