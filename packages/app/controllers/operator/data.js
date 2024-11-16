const { STATUS_CODES } = require("http");
const Joi = require("joi");
const ContactUsService = require("../../services/ContactUs");

// Joi schema for validating incoming query parameters
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
  active: Joi.boolean(),
});

/**
 * Controller responsible for fetching operator data.
 * Handles input validation and interacts with the ContactUsService.
 */
async function getOperatorDataController(req, res, next) {
  const contactUsService = new ContactUsService();
  try {
    // Validate the request query parameters using Joi schema
    const { error } = querySchema.validate(req.query);

    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }


    const { type, page, limit, active } = req.query;

    // Feteching paginated data using contactUsService
    const paginationData = await contactUsService.fetchOperatorData(type, page, limit, {
      activityStatus: active,
    });

    if (!paginationData) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: "Data not found!",
      });
    }

    // Extract pagination details and send the response
    const { total, totalPages, data } = paginationData;

    return res.status(200).json({
      message: "Successful",
      statusCode: 200,
      total,
      totalPages,
      results: data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

module.exports = getOperatorDataController;
