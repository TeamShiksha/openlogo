const { STATUS_CODES } = require("http");
const { ContactUsRepository } = require("../repositories");
const {
  querySchema,
  revertToCustomerPayloadSchema,
} = require("../schemas/operator");
const { ContactUsService } = require("../services");
const sendEmail = require("../utils/sendEmail");
const { Messages } = require("../utils/constants");

/**
 * Controller responsible for handling data fetching with pagination.
 * This controller is designed to fetch a subset of data based on pagination parameters
 * (`page` and `limit`) provided in the query string of the request. It validates the
 * incoming query parameters to ensure correctness using Joi.
 */
async function getMessagesController(req, res, next) {
  try {
    const contactUsRepository = new ContactUsRepository();
    const { error } = querySchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    let fetchedData = null;
    const { page, limit } = req.query;
    const { data, total, currentPage, totalPages } =
      await contactUsRepository.getAll(parseInt(page), parseInt(limit));
    if (!data || data.length === 0) {
      fetchedData = [];
    } else {
      fetchedData = data;
    }

    return res.status(200).json({
      message: Messages.FETCH_ALL_MESSAGE,
      statusCode: 200,
      total,
      currentPage,
      totalPages,
      results: fetchedData,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

/**
 * Controller responsible for responding back to customer.
 * Based on there queries. Uses `id` to identify the queries
 * and on sending the reponse the customer receives an email.
 */
async function respondMessagesController(req, res, next) {
  try {
    const contactUsService = new ContactUsService();
    const { error, value } = revertToCustomerPayloadSchema.validate({
      id: req.params.messageId,
      reply: req.body.reply,
    });

    if (error) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });
    }

    const { id, reply } = value;
    const formExists = await contactUsService.getForm(id);
    if (!formExists) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.MESSAGE_NOT_FOUND,
      });
    }

    const revertForm = await contactUsService.updateForm(id, reply);
    if (revertForm?.alreadyReplied) {
      return res.status(409).json({
        statusCode: 409,
        error: STATUS_CODES[409],
        message: Messages.ALREADY_SEND_RESPOND,
      });
    }

    await sendEmail({
      id: 3,
      subject: "Response to Your Query",
      recipient: formExists.email,
      body: {
        query: formExists.message,
        response: reply,
      },
    });

    return res.status(200).json({
      message: Messages.UPDATE_SUCESS,
      data: revertForm,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMessagesController, respondMessagesController };
