const Joi = require("joi");

const getLogoQuerySchema = Joi.object({
  domain: Joi.string()
    .regex(/^[A-Za-z0-9&:.-/]+$/)
    .required()
    .messages({
      "any.required": "Domain is required",
      "string.pattern.base": "Invalid domain",
    }),
  API_KEY: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "API key is required",
  }),
}).custom((value, helpers) => {
  const { domain } = value;
  const company = domain
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/(\.[A-Za-z]{2,})+$/, "")
    .toUpperCase();
  if (company == "") {
    return helpers.error("Domain cannot be empty");
  }
  return { ...value, company };
});

const getSearchQuerySchema = Joi.object({
  domainKey: Joi.string()
    .regex(/^[A-Za-z0-9&-/:.]+$/)
    .required()
    .messages({
      "any.required": "domainKey is required",
      "string.pattern.base": "Invalid domainKey",
    }),
  API_KEY: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "any.required": "API key is required",
  }),
}).custom((value, helpers) => {
  const { domainKey } = value;
  const companyNameBeginsWith = domainKey
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .match(/([A-Za-z0-9-]+)/)[1]
    .toUpperCase();
  if (companyNameBeginsWith === "") {
    return helpers.error("domainKey cannot be empty");
  }
  return { ...value, companyNameBeginsWith };
});

module.exports = { getLogoQuerySchema, getSearchQuerySchema };
