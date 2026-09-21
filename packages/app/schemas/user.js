const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { KeyTypes } = require("../utils/constants");

const originItemSchema = Joi.string()
  .trim()
  .uri({ scheme: [/https?/] })
  .messages({
    "string.uriCustomScheme": "Each origin must be a valid http or https URL",
    "string.uri": "Each origin must be a valid URL",
  });

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
  expires_at: Joi.number().required().valid(7, 30, 90, 180, 365).messages({
    "number.base": "Expiry must be a number",
    "any.only": "Expiry must be one of 7, 30, 90, 180, 365 days",
    "any.required": "Expiry is required",
  }),
  key_type: Joi.string()
    .valid(KeyTypes.SECRET, KeyTypes.PUBLISHABLE)
    .default(KeyTypes.SECRET)
    .messages({
      "any.only": "key_type must be SECRET or PUBLISHABLE",
    }),
  is_origin_restricted: Joi.boolean().default(false),
  allowed_origins: Joi.array()
    .items(originItemSchema)
    .default([])
    .when("is_origin_restricted", {
      is: true,
      then: Joi.array().items(originItemSchema).min(1).required().messages({
        "array.min":
          "At least one allowed origin is required when origin restriction is enabled",
        "any.required":
          "allowed_origins is required when origin restriction is enabled",
      }),
    }),
});

const updateKeyPayloadSchema = Joi.object()
  .keys({
    key_description: Joi.string()
      .trim()
      .max(20)
      .regex(/^[a-zA-Z\s]*$/)
      .messages({
        "string.base": "Description must be a string",
        "string.max": "Description must be 20 characters or fewer",
        "string.pattern.base":
          "Description must contain only alphabets and spaces",
      }),
    is_origin_restricted: Joi.boolean(),
    allowed_origins: Joi.array()
      .items(originItemSchema)
      .when("is_origin_restricted", {
        is: true,
        then: Joi.array().items(originItemSchema).min(1).required().messages({
          "array.min":
            "At least one allowed origin is required when origin restriction is enabled",
          "any.required":
            "allowed_origins is required when origin restriction is enabled",
        }),
      }),
    is_active: Joi.boolean(),
  })
  .min(1)
  .messages({
    "object.min": "At least one field must be provided to update",
  });

const logoRequestPyaloadSchema = Joi.object({
  user_id: Joi.string().trim().required().hex().length(24).messages({
    "any.required": "User ID is required",
    "string.length": "User ID must be exactly 24 characters long",
    "string.hex": "User ID must be a valid hexadecimal string",
  }),
  companyUrl: Joi.string()
    .trim()
    .required()
    .regex(
      /^(https?:\/\/)?((([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})|(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))(:\d+)?(\/.*)?$/
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
    .regex(/^[^!@#$%^&*(){}[\]\\.;'",.<>/?`~|0-9]*$/)
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
  logoRequestPyaloadSchema,
  destroyKeyPayloadSchema,
  generateKeyPayloadSchema,
  updateKeyPayloadSchema,
  changeNameEmailSchema,
};
