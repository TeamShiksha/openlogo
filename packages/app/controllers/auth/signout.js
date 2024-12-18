const { STATUS_CODES } = require("http");

/**
 * This controller clears the JWT cookie from the user's browser, effectively logging out the user.
 * It checks if a JWT cookie is present; if not, it returns a 400 error.
 */
async function signoutController(req, res, next) {
  try {
    const { jwt } = req.cookies;
    if (!jwt) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: "Failed to validate user session",
        statusCode: 400,
      });
    }

    res.clearCookie("jwt");
    return res.status(205).json({ statusCode: 205 });
  } catch (err) {
    next(err);
  }
}

module.exports = signoutController;