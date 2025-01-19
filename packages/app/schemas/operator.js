const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const querySchema = Joi.object({
  type: Joi.string().trim().required().messages({
    "string.empty": "Type is required",
  }),
  page: Joi.number().required().messages({
    "number.base": "Page number is required",
  }),
  limit: Joi.number().required().messages({
    "number.base": "Limit number is required",
  }),
});

const revertToCustomerPayloadSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Key ID must be a valid MongoDB ObjectId",
      "any.required": "Key ID is required",
    }),
  reply: Joi.string()
    .trim()
    .required()
    .min(20)
    .max(500)
    .regex(/^[^!@#$%^&*(){}\[\]\\\.;'",.<>/?`~|0-9]*$/)
    .messages({
      "string.base": "Reply must be a string",
      "string.min": "Reply should be at least 20 characters",
      "string.max": "Reply must be 500 or fewer characters",
      "any.required": "Reply is required",
      "string.pattern.base": "Reply should only contain alphabets",
    }),
});

module.exports = { querySchema, revertToCustomerPayloadSchema };
