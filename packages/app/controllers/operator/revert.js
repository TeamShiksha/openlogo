const Joi = require("joi");
const { STATUS_CODES } = require("http");
const { isValidObjectId } = require("mongoose");
const ContactUsService = require("../../services/ContactUs");

const revertToCustomerPayloadSchema = Joi.object().keys({
  id: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "any.invalid": "Key ID must be a valid MongoDB ObjectId",
      "any.required": "Key ID is required",
    }),
  reply: Joi.string()
    .trim()
    .required()
    .min(20)
    .max(500)
    .regex(/^[^!@#$%^&*(){}\[\]\\\.;'",.<>/?`~|0-9]*$/)
    .messages({
      "string.base": "Reply must be a string",
      "string.min": "Reply should be at least 20 characters",
      "string.max": "Reply must be 500 or fewer characters",
      "any.required": "Reply is required",
      "string.pattern.base": "Reply should only contain alphabets",
    }),
});

/**
* Controller responsible for responding back to customer.
* Based on there queries. Uses `id` to identify the queries
* and on sending the reponse the customer receives an email.
*/
async function revertToCustomerController(req, res, next) {
  const contactUsService = new ContactUsService();
  try {
    const { error, value } = revertToCustomerPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });
    }

    const { id, reply } = value;
    const { userId } = req.userData;
    const revertForm = await contactUsService.updateForm(id, reply, userId);
    if (revertForm?.alreadyReplied) {
      return res.status(409).json({
        statusCode: 409,
        error: STATUS_CODES[409],
        message: "Already sent the response for this query!",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Form updated successfully",
      data: revertForm,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = revertToCustomerController;
