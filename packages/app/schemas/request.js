const Joi = require("joi");
const { StatusTypes, TAB_OPTIONS } = require("../utils/constants");

const createRequestSchema = Joi.object({
  companyUrl: Joi.string()
    .trim()
    .required()
    .pattern(
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(:\d+)?(\/.*)?$/
    )
    .messages({
      "string.base": "Company URL must be a string",
      "string.empty": "Company URL cannot be empty",
      "any.required": "Company URL is required",
      "string.pattern.base": "Please enter a valid URL",
    }),
});

const updateRequestSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(StatusTypes))
    .required()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of PENDING, REJECTED, or RESOLVED",
      "any.required": "Status is required",
    }),
  comment: Joi.string().trim().allow(null).min(5).max(100).messages({
    "string.base": "Comment must be a string",
    "string.min": "Comment should be at least 5 characters",
    "string.max": "Comment must be 100 or fewer characters",
  }),
});

const requestQuerySchema = Joi.object({
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
  status: Joi.string()
    .valid(...Object.values(StatusTypes))
    .optional()
    .messages({
      "string.base": "Status must be a string",
      "any.only": "Status must be one of PENDING, REJECTED, or RESOLVED",
    }),
});

module.exports = {
  createRequestSchema,
  updateRequestSchema,
  requestQuerySchema,
};
