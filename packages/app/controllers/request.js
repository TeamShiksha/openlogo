const { STATUS_CODES } = require("http");
const { RequestService } = require("../services");
const {
  createRequestSchema,
  requestQuerySchema,
  updateRequestSchema,
} = require("../schemas/request");
const { Messages } = require("../utils/constants");

/**
 * Controller responsible for handling data fetching with pagination.
 * This controller is designed to fetch a subset of logo requests based on pagination parameters
 * (`page` and `limit`) provided in the query string of the request. It validates the
 * incoming query parameters to ensure correctness using Joi.
 */
async function getRequestsController(req, res, next) {
  try {
    const requestService = new RequestService();
    const { error, value } = requestQuerySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.message,
      });
    }

    const { page, limit } = value;
    const { data, total, currentPage, totalPages } =
      await requestService.getAllRequests(parseInt(page), parseInt(limit));

    const fetchedData = !data || data.length === 0 ? [] : data;

    return res.status(200).json({
      statusCode: 200,
      message: Messages.FETCH_ALL_REQUESTS,
      total,
      currentPage,
      totalPages,
      results: fetchedData,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller responsible for updating a logo request's status and feedback.
 * This controller validates the update payload, checks if the request exists,
 * and prevents processing of already handled requests. The operator's ID is
 * captured from the authenticated user session and associated with the response.
 */
async function updateRequestController(req, res, next) {
  try {
    const requestService = new RequestService();
    const requestId = req.params.requestId;
    const { error, value } = updateRequestSchema.validate(req.body);

    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.message,
      });
    }

    const { status, comment } = value;
    const operatorId = req.user.id;

    const request = await requestService.getRequestById(requestId);
    if (!request) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.LOGO_REQUEST_NOT_FOUND,
      });
    }

    const updatedRequest = await requestService.respondToRequest(
      requestId,
      operatorId,
      status,
      comment
    );

    if (updatedRequest?.alreadyProcessed) {
      return res.status(409).json({
        statusCode: 409,
        error: STATUS_CODES[409],
        message: Messages.LOGO_REQUEST_ALREADY_PROCESSED,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: Messages.UPDATE_SUCCESS,
      data: updatedRequest,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller responsible for handling the creation of a new logo request.
 * This controller validates the incoming request body using Joi schemas
 * to ensure data integrity before processing the request. On successful
 * validation, it creates a new request entry in the database.
 */
async function addRequestController(req, res, next) {
  try {
    const requestService = new RequestService();
    const { error, value } = createRequestSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.message,
      });
    }

    const newRequest = await requestService.createRaiseRequest(value);
    return res.status(201).json({
      statusCode: 201,
      message: Messages.LOGO_REQUEST_CREATED,
      data: newRequest,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addRequestController,
  getRequestsController,
  updateRequestController,
};
