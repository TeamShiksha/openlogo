const Joi = require("joi");
const { STATUS_CODES } = require("http");
const ImageService = require("../../services/Images");
const KeyService = require("../../services/Keys");
const SubscriptionService = require("../../services/Subscription");

const getLogoQuerySchema = Joi.object({
  domain: Joi.string()
    .regex(/^[A-Za-z0-9&:.-/]+$/)
    .required()
    .messages({
      "any.required": "Domain is required",
      "string.pattern.base": "Invalid domain",
    }),
  API_KEY: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "API key is required",
  }),
}).custom((value, helpers) => {
  const { domain } = value;
  const company = domain.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/(\.[A-Za-z]{2,})+$/, '').toUpperCase();
  if (company == "") {
    return helpers.error("Domain cannot be empty");
  }
  return { ...value, company };
});

/**
 * Handles requests for fetching a company's logo based on a domain and API key.
 * Validates input, checks subscription limits, fetches the logo, and updates API usage.
 * Responds with the logo URL or appropriate error messages.
 */
async function getLogoController(req, res, next) {
  try {
    const imageService = new ImageService();
    const keyService = new KeyService();
    const subscriptionService = new SubscriptionService();

    const { error, value } = getLogoQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }
    const { company, API_KEY } = value;

    const keyRef = await keyService.getApiKey(API_KEY);
    if (!keyRef) {
      return res.status(403).json({
        message: "Invalid API_KEY.",
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const userSubscription = await subscriptionService.getSubscription(keyRef.subscription_id);
    if(userSubscription.usage_count>=userSubscription.usage_limit) {
      return res.status(403).json({
        message: "Limit reached. Consider upgrading your plan",
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const imageUrl = await imageService.fetchImageByCompanyFree(company);
    await subscriptionService.incrementUsageCount(userSubscription);
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
