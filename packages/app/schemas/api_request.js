const Joi = require("joi");

/**
 * Schema for validating API request statistics query parameters
 * Accepts 'period' as either 'week' or 'month'
 */
const getStatsQuerySchema = Joi.object({
  period: Joi.string().valid("week", "month").required().messages({
    "any.required": "Period is required",
    "any.only": "Period must be either 'week' or 'month'",
  }),
});

module.exports = {
  getStatsQuerySchema,
};
