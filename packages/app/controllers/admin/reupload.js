const { uploadToS3, updateImageById } = require("../../services/Images");
const { STATUS_CODES } = require("http");
const Joi = require("joi");
const Image = require("../../models/Images");
const imageReuploadSchema = Joi.object().keys({
  id: Joi.string().trim().required().messages({
    "any.required": "Id is required",
  }),
});

async function adminReUploadController(req, res, next) {
  try {
    let { userId } = req.userData;
    let { id } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(422).json({
        statusCode: 422,
        message: "Image file is required",
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

    const exsitingImage = await Image.findById(id);

    if (!exsitingImage) {
      res.status(404).json({
        error: STATUS_CODES[404],
        statusCode: 404,
        message: "Image Not Found",
      });
    }
    const imageName = file.originalname;
    const Imagename = imageName.split(".")[0].toUpperCase();
    const Extension = imageName.split(".")[1].toLowerCase();

    if (
      Extension !== exsitingImage?.extension ||
      Imagename !== exsitingImage?.domainame
    ) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        statusCode: 400,
        message: "Image Name And Extension Must Be Same As Previous Image",
      });
    }

    const key = await uploadToS3(file, Imagename + "." + Extension, Extension);
    if (!key) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: "Image Upload Failed, try again later",
      });
    }

    const imageData = await updateImageById(id, {
      uploadedBy: userId,
      updatedAt: Date.now(),
    });

    if (!imageData) {
      res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: "Failed to update record",
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Reupload successfully",
      data: imageData,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = adminReUploadController;
