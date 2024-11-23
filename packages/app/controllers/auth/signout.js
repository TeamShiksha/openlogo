const { STATUS_CODES } = require("http");

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