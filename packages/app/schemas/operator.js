const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { TAB_OPTIONS, StatusTypes } = require("../utils/constants");

const querySchema = Joi.object({
  page: Joi.number().required().messages({
    "any.required": "Page number is required",
    "number.base": "Page number must be a number",
  }),
  limit: Joi.number().required().messages({
    "any.required": "Limit is required",
    "number.base": "Limit must be a number",
  }),
  tab: Joi.string()
    .valid(...Object.values(TAB_OPTIONS))
    .required()
    .messages({
      "string.base": "Tab must be a string",
      "any.required": "Tab is required",
      "any.only": "Tab must be either 'active' or 'archived'",
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
    .regex(/^[^!@#$%^&*(){}[\]\\;'"<>/`~|0-9]*$/)
    .messages({
      "string.base": "Reply must be a string",
      "string.min": "Reply should be at least 20 characters",
      "string.max": "Reply must be 500 or fewer characters",
      "any.required": "Reply is required",
      "string.pattern.base":
        "Reply should only contain alphabets, comma, period., question mark?",
    }),
  status: Joi.string()
    .valid(...Object.values(StatusTypes))
    .required()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of PENDING, REJECTED, or RESOLVED",
      "any.required": "Status is required",
    }),
});

const contactUsPayloadSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(20)
    .regex(/^[^!@#$%^&*(){}[\]\\;'"<>/`~|0-9]*$/)
    .messages({
      "string.base": "Name must be string",
      "string.min": "Name cannot be empty",
      "string.max": "Name length must be 20 or fewer",
      "any.required": "Name is required",
      "string.pattern.base": "Name should only contain alphabets",
    }),
  email: Joi.string()
    .trim()
    .required()
    .max(50)
    .regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    .messages({
      "string.base": "Email must be string",
      "string.max": "Email length must be 50 or fewer",
      "string.pattern.base": "Invalid email",
      "any.required": "Email is required",
    }),
  message: Joi.string()
    .trim()
    .required()
    .min(20)
    .max(500)
    .regex(/^[^!@#$%^&*(){}[\];'"<>/`~|0-9]*$/)
    .messages({
      "string.base": "Message must be string",
      "string.min": "Message should be at least be 20 characters",
      "string.max": "Message must be 500 or fewer characters",
      "any.required": "Message is required",
      "string.pattern.base":
        "Message should only contain alphabets, comma, period, question mark.",
    }),
});
module.exports = {
  querySchema,
  revertToCustomerPayloadSchema,
  contactUsPayloadSchema,
};
