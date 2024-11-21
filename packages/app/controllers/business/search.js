const Joi = require("joi");
const { STATUS_CODES } = require("http");

const ImageServices = require("../../services/Images");
const KeyServices = require("../../services/Keys");
const SubscriptionServices = require("../../services/Subscription");

const getSearchQuerySchema = Joi.object({
  domainKey: Joi.string()
    .regex(/^(https?:\/\/)?(www\.)?([A-Za-z0-9-]+)((\.[A-Za-z]{2,})+)$/)
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
  const companyNameBeginsWith = domainKey.replace(/^(https?:\/\/)?(www\.)?/, '')
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
 * Responds with a list of logos or appropriate error messages.
 */
async function searchLogoController(req, res, next) {
  const imageServices = new ImageServices();
  const keyServices = new KeyServices();
  const subscriptionServices = new SubscriptionServices();
  try {
    const { error, value } = getSearchQuerySchema.validate(req.query);
    if (!!error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { API_KEY, companyNameBeginsWith } = value;

    // API Key to user reference does not exist 
    const userWithSubscription = await keyServices.fetchUserWithSubscription(API_KEY);

    if (userWithSubscription.length === 0) {
      return res.status(403).json({
        message: "Invalid API key",
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const { subscriptionDetails } = userWithSubscription[0];
    if (subscriptionDetails.usageCount >= subscriptionDetails.usageLimit) {
      return res.status(403).json({
        message: "Limit reached. Consider upgrading your plan",
        statusCode: 403,
        error: STATUS_CODES[403],
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

    await subscriptionServices.incrementUsageCount(subscriptionDetails._id);

    return res.status(200).json({
      statusCode: 200,
      data: dataList,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = searchLogoController;
