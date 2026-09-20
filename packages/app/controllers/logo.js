const { STATUS_CODES } = require("http");
const {
  ImageService,
  KeyService,
  SubscriptionService,
  UserService,
} = require("../services");
const {
  getLogoQuerySchema,
  getSearchQuerySchema,
  getDemoSearchQuerySchema,
  getLogoImageQuerySchema,
} = require("../schemas/catalog");
const { Messages } = require("../utils/constants");

/**
 * Handles requests for fetching a company's logo based on a domain and API key.
 * Validates input, checks subscription limits, fetches the logo, and updates API usage.
 */
async function getLogoController(req, res, next) {
  try {
    const imageService = new ImageService();
    const keyService = new KeyService();
    const subscriptionService = new SubscriptionService();
    const userService = new UserService();

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
        message: Messages.INVALID_KEY,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }
    const keysNeedUpdate =
      !keyRef.expires_at ||
      keyRef.expires_at === null ||
      keyRef.expires_at === undefined;

    if (keysNeedUpdate) {
      return res.status(403).json({
        message: Messages.UPDATE_API_KEY,
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }
    if (keyRef.expires_at && new Date() > new Date(keyRef.expires_at)) {
      return res.status(403).json({
        message: Messages.API_KEY_EXPIRED,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const userSubscription = await subscriptionService.getSubscription(
      keyRef.subscription_id
    );
    if (userSubscription.usage_count >= userSubscription.usage_limit) {
      return res.status(403).json({
        message: Messages.LIMIT_REACHED,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const imageUrl = await imageService.fetchImageByCompanyFree(company);
    if (!imageUrl) {
      return res.status(404).json({
        message: Messages.LOGO_NOT_FOUND,
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    await userService.logLogoRequestEntry(company, userSubscription, keyRef);

    subscriptionService.incrementUsageCount(userSubscription).catch((err) => {
      console.error("Failed to increment usage count:", err.message);
    });
    return res.status(200).json({
      statusCode: 200,
      data: imageUrl,
    });
  } catch (err) {
    next(err);
  }
}

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
        message: Messages.INVALID_KEY,
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }

    const keysNeedUpdate =
      !key.expires_at ||
      key.expires_at === null ||
      key.expires_at === undefined;

    if (keysNeedUpdate) {
      return res.status(403).json({
        message: Messages.UPDATE_API_KEY,
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }

    if (key.expires_at && new Date() > new Date(key.expires_at)) {
      return res.status(403).json({
        message: Messages.API_KEY_EXPIRED,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const subscription = await subscriptionService.getSubscription(
      key.subscription_id
    );
    if (subscription.usage_count >= subscription.usage_limit) {
      return res.status(403).json({
        message: Messages.LIMIT_REACHED,
        error: STATUS_CODES[403],
        statusCode: 403,
      });
    }

    const regexPattern = new RegExp(
      `^${escapeRegex(companyNameBeginsWith)}`,
      "i"
    );
    const companyList = await imageServices.fetchCompanyList(regexPattern);
    if (companyList.length === 0) {
      return res.status(404).json({
        message: Messages.LOGO_NOT_FOUND,
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

/**
 * Handles logo search requests using a company name prefix for user demo.
 * Validates input, fetches matching companies and their logos.
 * Responds with a list of logos.
 */
async function demoSearchLogoController(req, res, next) {
  try {
    const imageServices = new ImageService();

    const { error, value } = getDemoSearchQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }
    const { companyNameBeginsWith } = value;

    const regexPattern = new RegExp(
      `^${escapeRegex(companyNameBeginsWith)}`,
      "i"
    );
    const companyList = await imageServices.fetchCompanyList(regexPattern);
    if (companyList.length === 0) {
      return res.status(404).json({
        message: Messages.LOGO_NOT_FOUND,
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    const dataList = await imageServices.getDataList(companyList);

    return res.status(200).json({
      statusCode: 200,
      data: dataList,
    });
  } catch (err) {
    next(err);
  }
}

const escapeRegex = (str) =>
  typeof str === "string" ? str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") : "";

const normalizeOrigin = (requestOrigin) => {
  if (!requestOrigin || typeof requestOrigin !== "string") return null;
  const sanitized = requestOrigin
    .replace(/[\r\n\t\0]/g, "")
    .trim()
    .replace(/\/+$/, "");
  return sanitized || null;
};

const validatePublishableKeyOrigin = (keyRef, normalizedRequestOrigin) => {
  if (!keyRef.is_origin_restricted) return true;
  if (!normalizedRequestOrigin) return false;

  const allowedOrigins = Array.isArray(keyRef.allowed_origins)
    ? keyRef.allowed_origins
    : [];

  return allowedOrigins.some((allowed) => {
    if (!allowed || typeof allowed !== "string") return false;
    return normalizedRequestOrigin === allowed.trim().replace(/\/+$/, "");
  });
};

const getPublishableKeyError = (keyRef) => {
  if (!keyRef || keyRef.is_active === false) {
    return {
      message: Messages.INVALID_PUBLISHABLE_KEY,
      statusCode: 401,
    };
  }
  if (keyRef.expires_at && new Date() > new Date(keyRef.expires_at)) {
    return {
      message: Messages.API_KEY_EXPIRED,
      statusCode: 401,
    };
  }
  return null;
};

const setLogoImageHeaders = (
  res,
  imageStreamResult,
  normalizedRequestOrigin
) => {
  res.setHeader("Content-Type", imageStreamResult.contentType);
  if (normalizedRequestOrigin) {
    res.setHeader("Access-Control-Allow-Origin", normalizedRequestOrigin);
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (imageStreamResult.contentLength) {
    res.setHeader("Content-Length", imageStreamResult.contentLength);
  }
};

const logRequestAndUsage = (
  userService,
  subscriptionService,
  company,
  userSubscription,
  keyRef
) => {
  if (!userSubscription) return;

  userService
    .logLogoRequestEntry(company, userSubscription, keyRef)
    .catch((err) => {
      console.error("Failed to log logo request entry:", err.message);
    });

  subscriptionService.incrementUsageCount(userSubscription).catch((err) => {
    console.error("Failed to increment usage count:", err.message);
  });
};

/**
 * Handles public direct logo image retrieval via publishable key and exact origin validation.
 * Streams binary image payload directly to client with appropriate CORS and Content-Type headers.
 */
async function getLogoImageController(req, res, next) {
  try {
    const imageService = new ImageService();
    const keyService = new KeyService();
    const subscriptionService = new SubscriptionService();
    const userService = new UserService();

    if (!req.query.PUBLISHABLE_KEY) {
      return res.status(401).json({
        message: Messages.INVALID_PUBLISHABLE_KEY,
        statusCode: 401,
        error: STATUS_CODES[401],
      });
    }

    const { error, value } = getLogoImageQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }
    const { company, PUBLISHABLE_KEY } = value;

    const keyRef = await keyService.getPublishableKey(PUBLISHABLE_KEY);
    const keyError = getPublishableKeyError(keyRef);
    if (keyError) {
      return res.status(keyError.statusCode).json({
        message: keyError.message,
        statusCode: keyError.statusCode,
        error: STATUS_CODES[keyError.statusCode],
      });
    }

    // Origin validation
    const normalizedRequestOrigin = normalizeOrigin(req.headers.origin);

    const isOriginValid = validatePublishableKeyOrigin(
      keyRef,
      normalizedRequestOrigin
    );
    if (!isOriginValid) {
      return res.status(403).json({
        message: Messages.ORIGIN_NOT_ALLOWED,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    let userSubscription = null;
    if (keyRef.subscription_id) {
      userSubscription = await subscriptionService.getSubscription(
        keyRef.subscription_id
      );
      if (
        userSubscription &&
        userSubscription.usage_count >= userSubscription.usage_limit
      ) {
        return res.status(403).json({
          message: Messages.LIMIT_REACHED,
          statusCode: 403,
          error: STATUS_CODES[403],
        });
      }
    }

    const imageDoc = await imageService.getImageByCompanyName(company);
    if (!imageDoc) {
      return res.status(404).json({
        message: Messages.LOGO_NOT_FOUND,
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    let imageStreamResult;
    try {
      imageStreamResult = await imageService.getImageStream(imageDoc);
    } catch (streamErr) {
      console.error(
        "Failed to retrieve image from storage:",
        streamErr.message
      );
      return res.status(404).json({
        message: Messages.LOGO_NOT_FOUND,
        statusCode: 404,
        error: STATUS_CODES[404],
      });
    }

    logRequestAndUsage(
      userService,
      subscriptionService,
      company,
      userSubscription,
      keyRef
    );

    setLogoImageHeaders(res, imageStreamResult, normalizedRequestOrigin);

    if (
      imageStreamResult.stream &&
      typeof imageStreamResult.stream.pipe === "function"
    ) {
      return imageStreamResult.stream.pipe(res);
    }
    return res.status(200).send(imageStreamResult.stream);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLogoController,
  searchLogoController,
  demoSearchLogoController,
  getLogoImageController,
};
