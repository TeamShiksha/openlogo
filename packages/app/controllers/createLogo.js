const { STATUS_CODES } = require("http");
const { ImageService } = require("../services");
const CreateLogoService = require("../services/createLogo");
const {
  Messages,
  ExtractCompanyNameFromUrlRegex,
} = require("../utils/constants");
const { companyUriSchema } = require("../schemas/catalog");

async function addCreateLogoController(req, res, next) {
  try {
    const createLogoServices = new CreateLogoService();
    const imageServices = new ImageService();
    const { userId } = req.userId;
    const imageSize = req.body.size;
    const companyUri = req.body.companyUri;
    const Extension = req.body.extension;

    const { error } = companyUriSchema.validate(companyUri);

    if (error) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: error.message,
      });
    }

    const match = companyUri
      .toUpperCase()
      .match(ExtractCompanyNameFromUrlRegex);
    const companyName = match[1];

    const imageExist = await imageServices.getImageByCompanyName(companyName);
    if (imageExist) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        statusCode: 400,
        message: Messages.IMAGE_ALREADY_EXISTS,
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
      return res.status(500).json({
        error: STATUS_CODES[500],
        statusCode: 500,
        message: Messages.UPDATE_IMAGE_FAILED,
      });
    }

    const createLogoData = await createLogoServices.addCreateLogoData(
      userId,
      companyUri,
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

module.exports = {
  addCreateLogoController,
};
