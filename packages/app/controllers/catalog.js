const { STATUS_CODES } = require("http");
const { UserService, ImageService } = require("../services");
const { addAdminSchema, imageReuploadSchema } = require("../schemas/admin");
const { Messages } = require("../utils/constants");

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

    const imageData = await imageService.getImagesByUserId(userId);
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

    const { error } = imageReuploadSchema.validate({ id });
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.details[0].message,
        error: STATUS_CODES[422],
      });
    }

    const exsitingImage = await imageServices.getImageById(id);
    const imageName = file.originalname;
    const Imagename = imageName.split(".")[0].toUpperCase();
    const Extension = imageName.split(".")[1].toLowerCase();
    const companyName = Imagename + "." + Extension;
    if (companyName !== exsitingImage.company_name) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        statusCode: 400,
        message: Messages.NAME_AND_EXT_SAME,
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

    const imageData = await imageServices.updateImageById(id, {
      uploadedBy: userId,
      updatedAt: Date.now(),
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
    const imageName = file.originalname;
    const Imagename = imageName.split(".")[0].toUpperCase();
    const Extension = imageName.split(".")[1].toLowerCase();
    const companyName = Imagename + "." + Extension;
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
      companyName
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
};
