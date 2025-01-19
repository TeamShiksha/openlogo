const { STATUS_CODES } = require("http");
const ContactUsRepository = require("../../repositories/ContactUs");
const { querySchema } = require("../../schemas/operator");

/**
 * Controller responsible for handling data fetching with pagination.
 * This controller is designed to fetch a subset of data based on pagination parameters
 * (`page` and `limit`) provided in the query string of the request. It validates the
 * incoming query parameters to ensure correctness using Joi.
 */
async function getOperatorDataController(req, res, next) {
  try {
    const contactUsRepository = new ContactUsRepository();
    const { error } = querySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { page, limit } = req.query;
    const { data, total, currentPage, totalPages } =
      await contactUsRepository.getAll(parseInt(page), parseInt(limit));
    if (!data || data.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: "Data not found!",
      });
    }

    return res.status(200).json({
      message: "Successful",
      statusCode: 200,
      total,
      currentPage,
      totalPages,
      results: data,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = getOperatorDataController;
