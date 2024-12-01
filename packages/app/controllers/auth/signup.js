const Joi = require("joi");
const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const SubscriptionService = require("../../services/Subscription");
const UserTokenService = require("../../services/UserToken");
const UserTokenTypes = require("../../utils/constants");

const signupPayloadSchema = Joi.object().keys({
  name: Joi.string()
    .trim()
    .required()
    .min(1)
    .max(20)
    .regex(/^[^!@#$%^&*(){}\[\]\\\.;'",.<>/?`~|0-9]*$/)
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
  password: Joi.string().trim().required().min(8).max(30).messages({
    "string.base": "Password must be string",
    "string.min": "Password must be at least 8 characters",
    "string.max": "Password must be 30 characters or fewer",
    "any.required": "Password is required"
  }),
  confirmPassword: Joi.any().required().equal(Joi.ref("password")).messages({
    "any.only": "Password and confirm password do not match"
  }),
});

async function signupController(req, res, next) {
  try {
    const userService = new UserService();
    const userTokenService = new UserTokenService();
    const subscriptionService = new SubscriptionService();
    const { error, value } = signupPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: error.message,
        error: STATUS_CODES[422],
        statusCode: 422,
      });
    }

    const { email } = value;
    const emailExists = await userService.getUserByEmail(email);
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
        error: STATUS_CODES[400],
        statusCode: 400
      });
    }

    const newSubscription = await subscriptionService.createSubscription();
    if (!newSubscription) {
      return res.status(500).json({
          message: "Something went wrong. Please Try again later!",
          statusCode: 500,
        });
    }
    
    Object.assign(value, { subscription_id: newSubscription._id });
    const newUser = await userService.createUser(value);
    if (!newUser) {
      return res.status(500).json({
          message: "Something went wrong. Try again later!",
          error: STATUS_CODES[500],
          statusCode: 500,
        });
    }

    const verificationToken = await userTokenService.createUserToken(newUser._id);
    if (!verificationToken){
        return res.status(206).json({
            message: "Registration Successful. Email failed to send. Contact us for assistance.",
            statusCode: 201,
        });
    }
    console.log(verificationToken.tokenURL());

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

module.exports = signupController;
