const Joi = require("joi");
const { STATUS_CODES } = require("http");
const ImageService = require("../../services/Images");
const KeyService = require("../../services/Keys");
const SubscriptionService = require("../../services/Subscription");

const getSearchQuerySchema = Joi.object({
  domainKey: Joi.string()
    .regex(/^[A-Za-z0-9&-/:.]+$/)
    .required()
    .messages({
      "any.required": "domainKey is required",
      "string.pattern.base": "Invalid domainKey",
    }),
  API_KEY: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "API key is required",
  }),
}).custom((value, helpers) => {
  const { domainKey } = value;
  const companyNameBeginsWith = domainKey
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .match(/([A-Za-z0-9-]+)/)[1]
    .toUpperCase();
  if (companyNameBeginsWith === "") {
    return helpers.error("domainKey cannot be empty");
  }
  return { ...value, companyNameBeginsWith };
});

/**
 * Handles logo search requests using a company name prefix and API key.
 * Validates input, checks subscription limits, fetches matching companies and their logos.
 * Responds with a list of logos.
 */
async function searchLogoController(req, res, next) {
  try {
    const imageServices = new ImageService();
    const keyService = new KeyService();
    const subscriptionService = new SubscriptionService();

    const { error, value } = getSearchQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }
    const { API_KEY, companyNameBeginsWith } = value;
    const key = await keyService.getApiKey(API_KEY);
    if (!key) {
      return res.status(403).json({
        message: "Invalid API KEY.",
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }

    const subscription = await subscriptionService.getSubscription(
      key.subscription_id,
    );
    if (subscription.usage_count >= subscription.usage_limit) {
      return res.status(403).json({
        message: "Subscription Limit reached. Consider upgrading your plan",
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }

    const regexPattern = new RegExp(`^${companyNameBeginsWith}`, "i");
    const companyList = await imageServices.fetchCompanyList(regexPattern);
    if (companyList.length === 0) {
      return res.status(404).json({
        message: "No companies found matching the provided domain key.",
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    const dataList = await imageServices.getDataList(companyList);
    await subscriptionService.incrementUsageCount(subscription);

    return res.status(200).json({
      statusCode: 200,
      data: dataList,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = searchLogoController;
