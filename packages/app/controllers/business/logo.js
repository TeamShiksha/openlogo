const Joi = require("joi");
const { STATUS_CODES } = require("http");

const ImageServices = require("../../services/Images");
const KeyServices = require("../../services/Keys");
const SubscriptionServices = require("../../services/Subscription");

const getLogoQuerySchema = Joi.object({
  domain: Joi.string()
    .regex(/^[A-Za-z0-9&-/:.]+$/)
    .required()
    .messages({
      "any.required": "Domain is required",
      "string.pattern.base": "Invalid domain",
    }),
  API_KEY: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "API key is required",
  }),
});

/**
 * Handles requests for fetching a company's logo based on a domain and API key.
 * Validates input, checks subscription limits, fetches the logo, and updates API usage.
 * Responds with the logo URL or appropriate error messages.
 */
async function getLogoController(req, res, next) {
  const imageServices = new ImageServices();
  const keyServices = new KeyServices();
  const subscriptionServices = new SubscriptionServices();

  try {
    const { error, value } = getLogoQuerySchema.validate(req.query);
    if (!!error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { domain, API_KEY } = value;
    const userId = await keyServices.fetchUser(API_KEY);
    const isExceed = await subscriptionServices.isApiUsageLimitExceed(userId);
    if (isExceed) {
      return res.status(403).json({
        message: "Limit reached. Consider upgrading your plan",
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    let company = domain.replace(/.+\/\/|www.|\..+/g, "").toUpperCase();
    const imageUrl = await imageServices.fetchImageByCompanyFree(company);
    await subscriptionServices.updateApiUsageCount(userId);
    if (!imageUrl) {
      return res.status(404).json({
        message: "Logo not available",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: imageUrl,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = getLogoController;
