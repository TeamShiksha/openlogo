const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const SubscriptionService = require("../../services/Subscription");
const UserTokenService = require("../../services/UserToken");
const { signupPayloadSchema } = require("../../schemas/auth");

/**
 * This controller validates the signup payload, checks if the email already exists,
 * creates a new subscription, registers a new user, and send a verification email.
 */
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
        statusCode: 400,
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

    const verificationToken = await userTokenService.createUserToken(
      newUser._id,
    );
    if (!verificationToken) {
      return res.status(206).json({
        message:
          "Registration Successful. Email failed to send. Contact us for assistance.",
        statusCode: 201,
      });
    }
    // send email function to be added
    console.log(verificationToken.tokenURL());

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

module.exports = signupController;
