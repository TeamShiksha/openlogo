const { STATUS_CODES } = require("http");
const Joi = require("joi");
const ContactUsRepository = require("../../repositories/ContactUs");

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

async function getOperatorDataController(req, res, next) {
  const contactUsRepository = new ContactUsRepository();

  try {
    const { error } = querySchema.validate(req.query);

    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { page, limit } = req.query;

    // Retrieve paginated data using the repository
    const { data, total, currentPage, totalPages } = await contactUsRepository.getAll(
      parseInt(page),
      parseInt(limit)
    );

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