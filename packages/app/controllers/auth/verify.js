const { STATUS_CODES } = require("http");
const UserTokenService = require("../../services/UserToken");
const UserService = require("../../services/User");

async function verifyTokenController(req, res, next) {
  try {
    const userTokenService = new UserTokenService();
    const userService = new UserService();
    const { token } = req.query;
    if (!token) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: "No token provided",
        statusCode: 422,
      });
    }

    const userToken = await userTokenService.fetchUserToken(token);
    if (!userToken)
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: "Invalid token",
        statusCode: 400,
      });

    if (userToken.isExpired())
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: "Token expired",
        statusCode: 403,
      });

    const user = await userService.getUser(userToken.user_id);
    if (!user)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "User doesn't exists",
        statusCode: 404,
      });

    const verifyResult = await userService.verifyUser(user._id);
    if (!verifyResult)
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: "Failed to verify user, try again",
        statusCode: 500,
      });

    const result = await userTokenService.deleteUserToken(userToken);
    if (!result) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: "Something went wrong",
        statusCode: 500,
      });
    }

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

module.exports = verifyTokenController;