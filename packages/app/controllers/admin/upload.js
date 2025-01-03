const ImageServices = require("../../services/Images");
const { STATUS_CODES } = require("http");

/**
 * Handles admin image uploads: saves to S3, records metadata in the database.
 * Extracts `userId` and file details, processes and uploads file.
 */
async function adminUploadController(req, res, next) {
  try {
    const imageServices = new ImageServices();
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
        message: "Image Upload Failed, try again later",
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
        message: "Failed to create record",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Upload successfully",
      data: imageData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = adminUploadController;
