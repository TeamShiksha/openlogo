const { STATUS_CODES } = require("http");
const ContactUsService = require("../../services/ContactUs");
const { revertToCustomerPayloadSchema } = require("../../schemas/operator");
const sendEmail = require("../../utils/sendEmail");

/**
 * Controller responsible for responding back to customer.
 * Based on there queries. Uses `id` to identify the queries
 * and on sending the reponse the customer receives an email.
 */
async function revertToCustomerController(req, res, next) {
  try {
    const contactUsService = new ContactUsService();
    const { error, value } = revertToCustomerPayloadSchema.validate(req.body);
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
        message: "Form not found",
      });
    }

    const revertForm = await contactUsService.updateForm(id, reply);
    if (revertForm?.alreadyReplied) {
      return res.status(409).json({
        statusCode: 409,
        error: STATUS_CODES[409],
        message: "Already sent the response for this query!",
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
      message: "Updated successfully",
      data: revertForm,
    });
  } catch (error) {
    next(error);
  }
}
module.exports = revertToCustomerController;
