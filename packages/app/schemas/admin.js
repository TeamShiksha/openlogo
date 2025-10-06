const Joi = require("joi");

const addAdminSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .required()
    .max(50)
    .regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    .messages({
      "string.base": "Email must be string",
      "string.max": "Email length must be 50 or fewer",
      "string.pattern.base": "Invalid email",
      "any.required": "Email is required",
    }),
});

const imageReuploadSchema = Joi.object().keys({
  id: Joi.string().trim().required().messages({
    "any.required": "Id is required",
  }),
});

module.exports = { addAdminSchema, imageReuploadSchema };
