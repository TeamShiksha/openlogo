const { STATUS_CODES } = require("http");
const {
  ImageService,
  RequestService,
  CreateLogoService,
} = require("../services");
const {
  Messages,
  ExtractCompanyNameFromUrlRegex,
} = require("../utils/constants");
const { companyUrlSchema } = require("../schemas/catalog");
const {
  updateRequestSchema,
  requestQuerySchema,
} = require("../schemas/request");

/**
 * Validates input, checks for existing requests, creates image data, and adds a new logo request.
 */
async function addLogoController(req, res, next) {
  try {
    const createLogoService = new CreateLogoService();
    const imageService = new ImageService();
    const requestService = new RequestService();
    const { userId } = req.userData;
    const imageSize = req.body.size;
    const companyUrl = req.body.companyUrl;
    const Extension = req.body.extension;

    const { error } = companyUrlSchema.validate(companyUrl);

    if (error) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: error.message,
      });
    }

    const match = companyUrl
      .toUpperCase()
      .match(ExtractCompanyNameFromUrlRegex);
    const companyName = match[1];

    const imageExist = await imageService.getImageByCompanyName(companyName);
    if (imageExist) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        statusCode: 400,
        message: Messages.IMAGE_ALREADY_EXISTS,
      });
    }

    const logoAlreadyRequested =
      await requestService.requestExistsForCompanyUrl(companyUrl);
    if (logoAlreadyRequested) {
      return res.status(400).json({
        message: Messages.COMPANY_URL_ALREADY_PENDING,
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const logoHasPendingRequest =
      await createLogoService.findPendingRequestByCompanyUrl(companyUrl);
    if (logoHasPendingRequest) {
      return res.status(400).json({
        message: Messages.LOGO_ALREADY_CREATED_AND_PENDING,
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const imageData = await imageService.createImageData(
      userId,
      imageSize,
      companyName,
      companyUrl,
      Extension,
      false
    );
    if (!imageData) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPDATE_IMAGE_FAILED,
      });
    }

    const createLogoData = await createLogoService.addLogoData(
      userId,
      companyUrl,
      imageData._id
    );
    res.status(200).json({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: createLogoData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Validates input, updates logo request status, and manages image visibility based on approval or rejection.
 */
async function updateLogoController(req, res, next) {
  try {
    const createLogoService = new CreateLogoService();
    const createLogoId = req.params.createLogoId;

    const { error, value } = updateRequestSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.message,
      });
    }
    const { status, comment } = value;
    const operatorId = req.userData.userId;

    const createdLogo = await createLogoService.getLogoById(createLogoId);
    if (!createdLogo) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.CREATED_LOGO_NOT_FOUND,
      });
    }

    const updateCreatedLogo = await createLogoService.respondToLogo(
      createLogoId,
      operatorId,
      status,
      comment
    );

    if (updateCreatedLogo?.alreadyProcessed) {
      return res.status(409).json({
        statusCode: 409,
        error: STATUS_CODES[409],
        message: Messages.LOGO_REQUEST_ALREADY_PROCESSED,
      });
    }

    const updatedLogoData = {
      companyUrl: createdLogo.companyUrl,
      status: status,
      comment: comment,
      openedAt: createdLogo.openedAt,
    };

    return res.status(200).json({
      statusCode: 200,
      message: Messages.UPDATE_SUCCESS,
      data: updatedLogoData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Validates input, fetches list of created logo, and returns paginated results.
 */
async function getLogoController(req, res, next) {
  try {
    const createLogoService = new CreateLogoService();
    const { error, value } = requestQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.message,
      });
    }

    const { page, limit, tab } = value;
    const { data, total, currentPage, totalPages } =
      await createLogoService.getPaginatedCreateLogos(
        parseInt(page),
        parseInt(limit),
        tab
      );

    const fetchedData = !data || data.length === 0 ? [] : data;

    const resultsWithPreview = await Promise.all(
      fetchedData.map(async (item) => {
        const detail = await createLogoService.getLogoDetails(item._id);
        return { ...item._doc, previewUrl: detail?.previewUrl || null };
      })
    );

    return res.status(200).json({
      statusCode: 200,
      message: Messages.FETCH_ALL_REQUESTS,
      total,
      currentPage,
      totalPages,
      results: resultsWithPreview,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addLogoController,
  updateLogoController,
  getLogoController,
};
