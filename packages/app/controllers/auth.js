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
const { Messages } = require("../utils/constants");
const User = require("../models/users");
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

    const newSubscription = await subscriptionService.createSubscription();
    if (!newSubscription) {
      return res.status(500).json({
        message: Messages.SOMETHING_WENT_WRONG,
        statusCode: 500,
      });
    }

    const { email, password, name } = value;
    let user = await userService.getUserByEmail(email);

    if (user) {
      // If the user is active (not deleted), block signup
      if (!user.is_deleted) {
        return res.status(400).json({
          message: "Account already exists.",
          error: STATUS_CODES[400],
          statusCode: 400,
        });
      }
      // Handle soft-deleted users
      if (user.deleted_at) {
        const tenureDays = 30;
        const expiry = new Date(user.deleted_at);
        expiry.setDate(expiry.getDate() + tenureDays);
        if (expiry > new Date()) {
          const daysLeft = Math.ceil(
            (expiry - Date.now()) / (1000 * 60 * 60 * 24)
          );
          return res.status(400).json({
            message: `Account exists. You may re-register after ${daysLeft} days.`,
            error: STATUS_CODES[400],
            statusCode: 400,
          });
        } else {
          await User.deleteOne({ _id: user._id });
          user = null;
        }
      }

      if (!user) {
        await userService.createUser({
          name,
          email,
          password,
          subscription_id: newSubscription._id,
        });
        return res.status(201).json({ message: "User created successfully." });
      }
    }

    Object.assign(value, { subscription_id: newSubscription._id });
    const newUser = await userService.createUser(value);
    if (!newUser) {
      return res.status(500).json({
        message: Messages.SOMETHING_WENT_WRONG,
        error: STATUS_CODES[500],
        statusCode: 500,
      });
    }

    const verificationToken = await userTokenService.createUserToken(
      newUser._id
    );
    if (!verificationToken) {
      return res.status(201).json({
        message: Messages.SOMETHING_WENT_WRONG,
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
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} res
 */
async function signinController(req, res, next) {
  try {
    const userService = new UserService();
    let user = {};
    if (req.query.type === "guest") {
      user = await userService.getGuestUser();
    } else {
      const { body: payload } = req;
      const { error, value } = signinPayloadSchema.validate(payload);
      if (error)
        return res.status(422).json({
          message: error.message,
          statusCode: 422,
          error: STATUS_CODES[422],
        });
      const { email, password } = value;
      user = await userService.getUserByEmail(email);
      if (!user)
        return res.status(404).json({
          error: STATUS_CODES[404],
          message: Messages.INCORRECT_EMAIL_PASS,
          statusCode: 404,
        });

      if (!user.is_verified)
        return res.status(403).json({
          error: STATUS_CODES[403],
          message: Messages.EMAIL_NOT_VERIFIED,
          statusCode: 403,
        });
      if (user.is_deleted) {
        return res.status(400).json({
          error: STATUS_CODES[400],
          message: "Account does not exist.",
          statusCode: 400,
        });
      }
      const matchPassword = await user.matchPassword(password);
      if (!matchPassword) {
        return res.status(404).json({
          error: STATUS_CODES[404],
          message: Messages.INCORRECT_EMAIL_PASS,
          statusCode: 404,
        });
      }
    }
    const currentDate = new Date();
    const oneDayValidityTimestamp = new Date(
      currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    /** @type {import("express").CookieOptions}  */
    const cookieOptions = {
      expires: oneDayValidityTimestamp,
      // sameSite: "strict",
      // httpOnly: true,
      // domain: ".openlogo.fyi",
    };

    res.cookie("jwt", user.generateJWT(), cookieOptions);

    return res.status(200).json({ statusCode: 200 });
  } catch (err) {
    next(err);
  }
}
/**
 * This controller clears the JWT cookie from the user's browser.
 * It checks if a JWT cookie is present; if not, it returns a 400 error.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} res
 */
function signoutController(req, res, next) {
  try {
    const { jwt } = req.cookies;
    if (!jwt) {
      return res.status(400).json({
        error: STATUS_CODES[400],
        message: Messages.SESSION_FAIL,
        statusCode: 400,
      });
    }

    /** @type {import("express").CookieOptions}  */
    const cookieOptions = {
      // sameSite: "strict",
      // httpOnly: true,
      // domain: ".openlogo.fyi",
    };

    res.clearCookie("jwt", cookieOptions);

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
        message: Messages.INVALID_TOKEN,
        statusCode: 422,
      });
    }

    const userToken = await userTokenService.fetchUserToken(token);

    if (!userToken) {
      const deletedToken = await userTokenService.fetchDeletedUserToken(token);

      if (deletedToken) {
        return res.status(200).json({
          statusCode: 200,
          message: Messages.EMAIL_ALREADY_VERIFIED,
          success: true,
          alreadyVerified: true,
        });
      }

      return res.status(400).json({
        error: STATUS_CODES[400],
        message: Messages.INVALID_TOKEN,
        statusCode: 400,
      });
    }

    if (userToken.isExpired()) {
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: Messages.EXPIRED_TOKEN,
        statusCode: 403,
      });
    }

    const user = await userService.getUser(userToken.user_id);
    if (!user) {
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: Messages.INVALID_TOKEN,
        statusCode: 404,
      });
    }

    if (user.is_verified) {
      await userTokenService.deleteUserToken(userToken);

      return res.status(200).json({
        statusCode: 200,
        message: Messages.EMAIL_ALREADY_VERIFIED,
        success: true,
        alreadyVerified: true,
      });
    }

    const verifyResult = await userService.verifyUser(user._id);
    if (!verifyResult) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: Messages.VERIFICATION_FAIL,
        statusCode: 500,
      });
    }

    const result = await userTokenService.deleteUserToken(userToken);
    if (!result) {
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: Messages.SOMETHING_WENT_WRONG,
        statusCode: 500,
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Email verified successfully",
      success: true,
    });
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
        message: Messages.EMAIL_DOESNT_EXISTS,
        statusCode: 404,
      });

    const userToken = await userTokenService.createForgotToken(user._id);
    if (!userToken)
      return res.status(500).json({
        error: STATUS_CODES[500],
        message: Messages.SOMETHING_WENT_WRONG,
        statusCode: 500,
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
        message: Messages.INVALID_TOKEN,
        statusCode: 422,
      });

    const userToken = await userTokenService.fetchUserToken(token);
    if (!userToken)
      return res.status(404).json({
        error: STATUS_CODES[404],
        message: Messages.USER_NOT_FOUND,
        statusCode: 404,
      });

    if (userToken.isExpired()) {
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: Messages.EXPIRED_TOKEN,
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
        message: Messages.VERIFICATION_FAIL,
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
        message: Messages.PASS_FAILED,
        statusCode: 400,
      });
    }

    let userToken = await userTokenService.fetchUserToken(value.token);
    if (userToken === null || userToken.token !== value.token) {
      return res.status(403).json({
        error: STATUS_CODES[403],
        message: Messages.PASS_FAILED,
        statusCode: 403,
      });
    }
    await userTokenService.deleteUserToken(userToken);
    return res.status(200).json({ statusCode: 200 });
  } catch (error) {
    next(error);
  }
}

function validateSessionController(req, res) {
  return res.status(200).json({ statusCode: 200, userData: req.userData });
}

module.exports = {
  signupController,
  signinController,
  signoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordSessionController,
  resetPasswordController,
  validateSessionController,
};
