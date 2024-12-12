const ImageServices = require("../../services/Images");
const { STATUS_CODES } = require("http");

/**
 * @function adminUploadController
 * @description Handles the image upload process for the admin user.
 *
 * This controller performs the following steps:
 * 1. Extracts the `userId` from the request's userData and retrieves the uploaded file details.
 * 2. Processes the file to construct an image name (uppercase name with extension).
 * 3. Uploads the file to an Amazon S3 bucket using the `ImageServices` class.
 * 4. If the upload is successful, creates a record for the image in the database with metadata:
 *    - userId: ID of the user uploading the image.
 *    - imageSize: Size of the uploaded file.
 *    - companyUri: Placeholder for additional URI details.
 *    - companyName: Generated image name (including extension).
 * 5. Sends a success response to the client with the stored image metadata.
 * 6. Handles any failures during the upload or record creation process and returns appropriate
 *    error responses with a 500 status code.
 * @param {Object} req - Request object containing userData and file.
 * @param {Object} res - Response object to send status and data.
 * @returns {JSON} - Success or error response.
 * */
async function adminUploadController(req, res, next) {
  try {
    const imageServices = new ImageServices();
    let { userId } = req.userData;
    const file = req.file;
    const imageSize = file.size;
    const companyUri = " ";

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
      companyUri,
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
