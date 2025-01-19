const { STATUS_CODES } = require("http");
const RequestService = require("../../services/Request");
const { postRaiseRequestPayloadSchema } = require("../../schemas/user");

/**
 * This controller accepts a payload from the client, validates it, and creates
 * a new raise request using the `RequestService`. If any step fails, an
 * appropriate error response is returned. Otherwise, it responds with a success status.
 */
async function raiseRequestController(req, res, next) {
  try {
    const requestService = new RequestService();
    const { error, value } = postRaiseRequestPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const raiseRequest = await requestService.createRaiseRequest(value);
    if (!raiseRequest) {
      return res.status(500).json({
        message: "Something went wrong, try again later",
        statusCode: 500,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = raiseRequestController;
