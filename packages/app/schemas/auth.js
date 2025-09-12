const Joi = require("joi");
const { EmailValidationRegex } = require("../utils/constants");

const signinPayloadSchema = Joi.object().keys({
  email: Joi.string().trim().required().regex(EmailValidationRegex).messages({
    "string.base": "Email must be a string",
    "any.required": "Email is required",
    "string.pattern.base": "Invalid email",
  }),

  password: Joi.string().trim().required().messages({
    "string.base": "Password must be string",
    "any.required": "Password is required",
  }),
});

const signupPayloadSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(20)
    .regex(/^[^!@#$%^&*(){}[\]\\;'",.<>/?`~|0-9]*$/)
    .messages({
      "string.base": "Name must be string",
      "string.min": "Name cannot be empty",
      "string.max": "Name length must be 20 or fewer",
      "any.required": "Name is required",
      "string.pattern.base": "Name should only contain alphabets",
    }),
  email: Joi.string()
    .trim()
    .required()
    .max(50)
    .regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    .messages({
      "string.base": "Email must be a string",
      "string.max": "Email lenght must be 50 or fewer",
      "any.required": "Email is required",
      "string.pattern.base": "Invalid email",
    }),
  password: Joi.string()
    .trim()
    .required()
    .min(8)
    .max(30)
    .pattern(/[A-Z]/, { name: "uppercase" })
    .pattern(/[a-z]/, { name: "lowercase" })
    .pattern(/\d/, { name: "digit" })
    .pattern(/[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/, { name: "special" }) // at least one special char
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must be 30 characters or fewer",
      "any.required": "Password is required",
      "string.pattern.name":
        "Password must contain at least one {#name} character",
    }),
  confirmPassword: Joi.any().required().equal(Joi.ref("password")).messages({
    "any.only": "Password and confirm password do not match",
  }),
});

const forgotPasswordSchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .required()
    .regex(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
    .messages({
      "string.base": "Email must be string",
      "any.required": "Email is required",
      "string.pattern.base": "Invalid email",
    }),
});

const patchSchema = Joi.object().keys({
  newPassword: Joi.string()
    .trim()
    .required()
    .min(8)
    .max(30)
    .pattern(/[A-Z]/, { name: "uppercase" })
    .pattern(/[a-z]/, { name: "lowercase" })
    .pattern(/\d/, { name: "digit" })
    .pattern(/[!@#$%^&*()_+{}\\[\]:;<>,.?~\\/-]/, { name: "special" }) // at least one special char
    .messages({
      "string.base": "New password must be a string",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password must be 30 characters or fewer",
      "any.required": "New password is required",
      "string.pattern.name":
        "New password must contain at least one {#name} character",
    }),
  confirmPassword: Joi.string()
    .required()
    .equal(Joi.ref("newPassword"))
    .messages({
      "any.only": "Password and confirm password do not match",
      "any.required": "Confirm password is required",
    }),
  token: Joi.string().trim().required().messages({
    "string.base": "Token must be a string",
    "any.required": "Token is required",
  }),
});

module.exports = {
  signinPayloadSchema,
  signupPayloadSchema,
  forgotPasswordSchema,
  patchSchema,
};
