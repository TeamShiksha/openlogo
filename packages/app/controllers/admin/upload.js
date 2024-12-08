const { createImageData, uploadToS3 } = require("../../services/Images");
const { STATUS_CODES } = require("http");

async function adminUploadController(req, res, next) {
  try {
    let { userId } = req.userData;
    const file = req.file;

    if (!file) {
      return res.status(422).json({
        statusCode: 422,
        message: 
           "Image file is required",
        error: STATUS_CODES[422],
      });
    }

    const imageName = file.originalname;
    const Imagename = imageName.split(".")[0].toUpperCase();
    const Extension = imageName.split(".")[1].toLowerCase();

    const key = await uploadToS3(file, Imagename + "." + Extension, Extension);
    if (!key) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: "Image Upload Failed, try again later",
      });
    }
    const imageData = await createImageData(Imagename, userId, Extension);
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

module.exports = { adminUploadController };