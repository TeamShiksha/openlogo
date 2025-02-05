const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const UserTokenService = require("../../services/UserToken");
const { forgotPasswordSchema } = require("../../schemas/auth");
const sendEmail = require("../../utils/sendEmail");

/**
 * This controller processes a token provided in the request query.
 * It validates the token, checks its expiration, fetches the associated user,
 * and attempts to verify the user's account.
 */
async function forgotPasswordController(req, res, next) {
  try {
    const userService = new UserService();
    const userTokenService = new UserTokenService();
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error)
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });

    const { email } = value;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "Email does not exist",
        statusCode: 404,
      });

    const userToken = await userTokenService.createForgotToken(user._id);
    if (!userToken)
      return res.status(503).json({
        error: STATUS_CODES[503],
        message: "Unable to process request",
        statusCode: 503,
      });

    await sendEmail({
      id: 1,
      subject: "Reset Your Password",
      recipient: email,
      body: {
        url: userToken.tokenURL(),
      },
    });

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

module.exports = forgotPasswordController;
