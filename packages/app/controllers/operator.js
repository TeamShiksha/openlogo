const { STATUS_CODES } = require("http");
const { ContactUsRepository } = require("../repositories");
const {
  querySchema,
  revertToCustomerPayloadSchema,
  contactUsPayloadSchema,
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
    const { page, limit, tab } = req.query;
    const { data, total, currentPage, totalPages } =
      await contactUsRepository.getAll(parseInt(page), parseInt(limit), tab);
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
      status: req.body.status,
    });

    if (error) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });
    }

    const { id, reply, status } = value;
    const operatorId = req.userData.userId;
    const formExists = await contactUsService.getForm(id);
    if (!formExists) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.MESSAGE_NOT_FOUND,
      });
    }

    const revertForm = await contactUsService.updateForm(
      id,
      reply,
      status,
      operatorId
    );
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
      message: Messages.UPDATE_SUCCESS,
      data: revertForm,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Controller responsible for handling Contact Us form submissions.
 * Validates input, checks for existing active form by email,
 * prevents duplicate submissions, and stores new entries.
 */

async function addMessagesController(req, res, next) {
  try {
    const { error, value } = contactUsPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });
    }

    const { email } = value;
    const contactUsService = new ContactUsService();
    const form = await contactUsService.formExists(email);
    if (form) {
      return res.status(400).json({
        message: Messages.FORM_ALREADY_SUBMITTED,
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const newForm = await contactUsService.createForm(value);
    if (!newForm) {
      return res.status(500).json({
        message: Messages.INTERNAL_SERVER_ERROR,
        statusCode: 500,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      message: Messages.FORM_SUBMITTED,
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMessagesController,
  respondMessagesController,
  addMessagesController,
};
