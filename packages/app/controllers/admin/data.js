const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const ImageService = require("../../services/Images");

/**
 * Retrieves the list of images uploaded by a specific user.
 * Validates the user existence and fetches associated images from the database.
 * Returns an empty array if no images are found.
 */
const getImagesController = async (req, res, next) => {
  try {
    const userService = new UserService();
    const imageService = new ImageService();
    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: "User document not found",
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
};

module.exports = getImagesController;
