const { STATUS_CODES } = require("http");
const {
  UserService,
  ImageService,
  KeyService,
  RequestService,
  SubscriptionService,
  ContactUsService,
} = require("../services");
const { addAdminSchema, imageReuploadSchema } = require("../schemas/admin");
const { companyUriSchema } = require("../schemas/catalog");
const {
  Messages,
  ExtractCompanyNameFromUrlRegex,
} = require("../utils/constants");

async function getAnalyticsController(req, res, next) {
  try {
    const userService = new UserService();
    const totalUsers = await userService.getUsersCount();
    const keyService = new KeyService();
    const totalKeys = await keyService.getKeysCount();
    const requestService = new RequestService();
    const contactUsService = new ContactUsService();
    const totalContactUs = await contactUsService.getFormsCount();
    const totalRequests = await requestService.getRequestsCount();
    const subscriptionService = new SubscriptionService();
    const totalHits = await subscriptionService.getSubscriptionUsageCount();

    return res.status(200).json({
      statusCode: 200,
      data: [
        {
          title: "Users",
          value: totalUsers,
        },
        {
          title: "Keys",
          value: totalKeys,
        },

        {
          title: "Requests",
          value: totalRequests + totalContactUs,
        },
        {
          title: "Hits",
          value: totalHits,
        },
      ],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Promotes a user to admin or operator role using their email.
 * Validates email input and updates user role if the user exists.
 */
async function addPermissionController(req, res, next) {
  try {
    const userService = new UserService();
    const email = req.body.email;
    const { error } = addAdminSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.message,
        error: STATUS_CODES[422],
      });
    }

    const response = await userService.updateUserToAdmin(email);
    if (!response) {
      return res.status(404).json({
        statusCode: 404,
        message: Messages.USER_NOT_FOUND,
        error: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves the list of images uploaded by a specific user.
 * Validates the user existence and fetches associated images from the database.
 * Returns an empty array if no images are found.
 */
async function getCatalogController(req, res, next) {
  try {
    const userService = new UserService();
    const imageService = new ImageService();
    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.USER_NOT_FOUND,
      });
    }

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const imageData = await imageService.getImagesByUserId(userId, skip, limit);
    if (!imageData)
      return res.status(200).json({
        statusCode: 200,
        data: [],
      });

    return res.status(200).json({
      statusCode: 200,
      data: imageData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Manages re-uploading an image for admin users.
 * Validates input, uploads to S3, updates database.
 */
async function updateCatalogController(req, res, next) {
  try {
    const imageServices = new ImageService();
    const { userId } = req.userData;
    const { id } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(422).json({
        statusCode: 422,
        message: Messages.IMAGE_REQUIRED,
        error: STATUS_CODES[422],
      });
    }

    const imageSize = file.size;

    const { error } = imageReuploadSchema.validate({ id });
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.details[0].message,
        error: STATUS_CODES[422],
      });
    }

    const previousImageData = await imageServices.getImageById(id);
    if (!previousImageData) {
      return res.status(404).json({
        error: STATUS_CODES[404],
        statusCode: 404,
        message: Messages.UPLOAD_FAILED,
      });
    }

    const imageName = file.originalname;
    const companyName = previousImageData.company_name;
    const Extension = imageName.split(".")[1].toLowerCase();

    const key = await imageServices.uploadToS3(file, companyName, Extension);
    if (!key) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPLOAD_FAILED,
      });
    }

    const imageData = await imageServices.updateImageById(id, {
      uploadedBy: userId,
      updatedAt: Date.now(),
      imageSize,
      companyName,
      Extension,
    });
    if (!imageData) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPDATE_IMAGE_FAILED,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: imageData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Handles admin image uploads: saves to S3, records metadata in the database.
 * Extracts `userId` and file details, processes and uploads file.
 */
async function addCatalogController(req, res, next) {
  try {
    const imageServices = new ImageService();
    let { userId } = req.userData;
    const file = req.file;
    const imageSize = file.size;
    const companyUri = req.body.companyUri;
    const { error } = companyUriSchema.validate(companyUri);
    if (error) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: error.message,
      });
    }

    const imageName = file.originalname;
    const match = companyUri
      .toUpperCase()
      .match(ExtractCompanyNameFromUrlRegex);
    const companyName = match[1];
    const Extension = imageName.split(".")[1].toLowerCase();

    const imageExist = await imageServices.getImageByCompanyName(companyName);
    if (imageExist) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        statusCode: 400,
        message: Messages.IMAGE_ALREADY_EXISTS,
      });
    }

    const key = await imageServices.uploadToS3(file, companyName, Extension);
    if (!key) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPLOAD_FAILED,
      });
    }

    const imageData = await imageServices.createImageData(
      userId,
      imageSize,
      companyName,
      companyUri,
      Extension
    );
    if (!imageData) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPDATE_IMAGE_FAILED,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: Messages.UPLOAD_SUCCESS,
      data: imageData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addPermissionController,
  getCatalogController,
  updateCatalogController,
  addCatalogController,
  getAnalyticsController,
};
