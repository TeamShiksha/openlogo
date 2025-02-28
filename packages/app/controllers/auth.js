const jwt = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const {
  UserService,
  SubscriptionService,
  UserTokenService,
} = require("../services");
const {
  signupPayloadSchema,
  signinPayloadSchema,
  forgotPasswordSchema,
  patchSchema,
} = require("../schemas/auth");
const sendEmail = require("../utils/sendEmail");

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
      newUser._id
    );
    if (!verificationToken) {
      return res.status(201).json({
        message: "Something went wrong. Try again later!",
        statusCode: 201,
      });
    }

    await sendEmail({
      id: 2,
      subject: "Openlogo: Email Verification",
      recipient: email,
      body: {
        url: verificationToken.tokenURL(),
      },
    });

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the sign-in payload, checks if the email exists,
 * verifies the user's email status, and compares the provided password with
 * the stored one. Set sets a JWT cookie and returns a successful response.
 */
async function signinController(req, res, next) {
  try {
    const userService = new UserService();
    const { body: payload } = req;
    const { error, value } = signinPayloadSchema.validate(payload);
    if (error)
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });

    const { email, password } = value;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "Incorrect email or password",
        statusCode: 404,
      });

    if (!user.is_verified)
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: "Email not verified",
        statusCode: 403,
      });

    const matchPassword = await user.matchPassword(password);
    if (!matchPassword) {
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "Incorrect email or password",
        statusCode: 404,
      });
    }

    const currentDate = new Date();
    const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    res.cookie("jwt", user.generateJWT(), {
      expires: tomorrow,
      sameSite: "none",
      secure: true,
    });

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller clears the JWT cookie from the user's browser.
 * It checks if a JWT cookie is present; if not, it returns a 400 error.
 */
function signoutController(req, res, next) {
  try {
    const { jwt } = req.cookies;
    if (!jwt) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: "Failed to validate user session",
        statusCode: 400,
      });
    }

    res.clearCookie("jwt");
    return res.status(205).send();
  } catch (err) {
    next(err);
  }
}

/**
 * This controller processes a token provided in the request query.
 * It validates the token, checks its expiration, fetches the
 * associated user, and attempts to verify the user's account.
 */
async function verifyEmailController(req, res, next) {
  try {
    const userTokenService = new UserTokenService();
    const userService = new UserService();
    const { token } = req.params;
    if (!token) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: "No token provided",
        statusCode: 422,
      });
    }

    const userToken = await userTokenService.fetchUserToken(token);
    if (!userToken)
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: "Invalid token",
        statusCode: 400,
      });

    if (userToken.isExpired())
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: "Token expired",
        statusCode: 403,
      });

    const user = await userService.getUser(userToken.user_id);
    if (!user)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "Invalid token",
        statusCode: 404,
      });

    const verifyResult = await userService.verifyUser(user._id);
    if (!verifyResult)
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: "Verification failed",
        statusCode: 500,
      });

    const result = await userTokenService.deleteUserToken(userToken);
    if (!result) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: "Something went wrong",
        statusCode: 500,
      });
    }

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller processes a token provided in the request query.
 * It validates the token, checks its expiration, fetches the associated user,
 * and attempts to verify the user's account.
 */
async function forgotPasswordController(req, res, next) {
  try {
    const userService = new UserService();
    const userTokenService = new UserTokenService();
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error)
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });

    const { email } = value;
    const user = await userService.getUserByEmail(email);
    if (!user)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "Email does not exist",
        statusCode: 404,
      });

    const userToken = await userTokenService.createForgotToken(user._id);
    if (!userToken)
      return res.status(503).json({
        error: STATUS_CODES[503],
        message: "Unable to process request",
        statusCode: 503,
      });

    await sendEmail({
      id: 1,
      subject: "Reset Your Password",
      recipient: email,
      body: {
        url: userToken.tokenURL(),
      },
    });

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the query parameters, retrieves the user token,
 * checks its validity and creates a secure session cookie for resetting
 * the user's password.
 */
async function resetPasswordSessionController(req, res, next) {
  try {
    const userTokenService = new UserTokenService();
    const { token } = req.params;
    if (!token)
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: "Invalid or expired token",
        statusCode: 422,
      });

    const userToken = await userTokenService.fetchUserToken(token);
    if (!userToken)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: "User Token not found",
        statusCode: 404,
      });

    if (userToken.isExpired()) {
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: "Token expired",
        statusCode: 403,
      });
    }

    res.cookie(
      "resetPasswordSession",
      jwt.sign(
        { userId: userToken.user_id.toString(), token: userToken.token },
        process.env.JWT_SECRET
      )
    );

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the user's password reset session from cookies,
 * verifies the provided token, updates the user's password with the new
 * hashed password, and soft deletes the used token.
 */
async function resetPasswordController(req, res, next) {
  try {
    const userService = new UserService();
    const userTokenService = new UserTokenService();
    const { resetPasswordSession } = req.cookies;
    if (!resetPasswordSession) {
      return res.status(401).json({
        error: STATUS_CODES[401],
        message: "User is not signed in",
        statusCode: 401,
      });
    }

    const decodedData = jwt.verify(
      resetPasswordSession,
      process.env.JWT_SECRET
    );
    const { userId } = decodedData;
    const { error, value } = patchSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        error: STATUS_CODES[422],
        message: error.message,
        statusCode: 422,
      });
    }

    const user = await userService.getUser(userId);
    const result = await userService.updateUserPassword(
      user,
      value.newPassword
    );
    if (!result) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: "Failed to update password",
        statusCode: 400,
      });
    }

    let userToken = await userTokenService.fetchUserToken(value.token);
    if (userToken === null || userToken.token !== value.token) {
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: "Invalid credentials",
        statusCode: 403,
      });
    }
    await userTokenService.deleteUserToken(userToken);
    return res.status(200).json({ statusCode: 200 });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  signupController,
  signinController,
  signoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordSessionController,
  resetPasswordController,
};
