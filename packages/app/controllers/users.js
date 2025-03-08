const { STATUS_CODES } = require("http");
const {
  UserService,
  KeyService,
  SubscriptionService,
  RequestService,
} = require("../services");
const {
  changeNameEmailSchema,
  generateKeyPayloadSchema,
  destroyKeyPayloadSchema,
  updatePasswordPayloadSchema,
  logoRequestPyaloadSchema,
} = require("../schemas/user");
const { Messages } = require("../utils/constants");

/**
 * This controller fetches the authenticated user's data from the database
 * based on their `userId`. It also retrieves the user's subscription details
 * and associated keys to provide a complete data set. If any data is missing,
 * an appropriate response is sent.
 */
async function getUserDataController(req, res, next) {
  try {
    const userService = new UserService();
    const keyService = new KeyService();
    const subscriptionService = new SubscriptionService();

    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.USER_NOT_FOUND,
      });
    }

    const data = {};
    const subscriptionData = await subscriptionService.getSubscription(
      user.subscription_id
    );
    const keysData = await keyService.getAllUserKeys(user.keys);
    if (!keysData || !subscriptionData) {
      return res.status(206).json({
        statusCode: 206,
        error: STATUS_CODES[206],
        message: Messages.DATA_NOT_FOUND,
      });
    }

    Object.assign(data, user.data(), {
      subscription: subscriptionData,
      keys: keysData,
    });
    return res.status(200).json({
      statusCode: 200,
      data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the request payload, verifies the existence of the user,
 * and updates the user's profile with the provided name.
 */
async function updateProfileController(req, res, next) {
  try {
    const userService = new UserService();
    const { name } = req.body;
    const { error } = changeNameEmailSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        message: error.message,
        error: STATUS_CODES[422],
      });
    }

    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.USER_NOT_FOUND,
      });
    }

    const profileUpdatedSuccessfully = userService.updateUser(name, user._id);
    if (!profileUpdatedSuccessfully) {
      return res.status(500).json({
        statusCode: 500,
        message: Messages.SOMETHING_WENT_WRONG,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * This controller retrieves the user's ID from `req.userData`, invokes the
 * `deleteUserAccount` method from the `UserService` to remove the user account
 * from the system, and responds with a success status if the operation completes
 * without errors.
 */
async function deleteUserAccountController(req, res, next) {
  try {
    const userService = new UserService();
    const { userId } = req.userData;
    await userService.deleteUserAccount(userId);
    res.status(200).json({
      status: 200,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the request payload, checks the user's subscription key limit,
 * and creates a new API key if the user is eligible. If the key limit is reached or any
 * validation fails, appropriate error responses are returned.
 */
async function generateKeyController(req, res, next) {
  try {
    const userService = new UserService();
    const subscriptionService = new SubscriptionService();

    const { key_description } = req.body;
    const { error } = generateKeyPayloadSchema.validate({ key_description });
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    const subscription = await subscriptionService.getSubscription(
      user.subscription_id
    );
    if (user.keys.length >= subscription.key_limit) {
      return res.status(403).json({
        message: Messages.LIMIT_REACHED,
        statusCode: 403,
        error: STATUS_CODES[403],
      });
    }

    const newKey = {
      key_description: req.body.key_description,
      subscription_id: subscription._id,
    };
    const newUserKey = await userService.createNewUserKey(newKey, user);
    return res.status(200).json({
      statusCode: 200,
      data: newUserKey,
    });
  } catch (err) {
    next(err);
  }
}

async function destroyKeyController(req, res, next) {
  try {
    const userService = new UserService();
    const { error, value } = destroyKeyPayloadSchema.validate(req.query);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { userId } = req.userData;
    const user = await userService.getUser(userId);
    const destroyedKey = await userService.destroyUserKey(value.keyId, user);
    if (!destroyedKey) {
      return res.status(404).json({
        message: Messages.INVALID_KEY,
        statusCode: STATUS_CODES[404],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller validates the current and new passwords from the request body,
 * verifies the user's identity, and updates the password if the current password
 * is correct.
 */
async function updatePasswordController(req, res, next) {
  try {
    const userService = new UserService();
    const { error, value } = updatePasswordPayloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const { currPassword, newPassword } = value;
    const { email } = req.userData;
    const user = await userService.getUserByEmail(email);
    const matchPassword = await user.matchPassword(currPassword);
    if (!matchPassword) {
      return res.status(400).json({
        message: Messages.INCORRECT_PASSWORD,
        statusCode: 400,
        error: STATUS_CODES[400],
      });
    }

    const userUpdateSuccessful = await userService.updateUserPassword(
      user,
      newPassword
    );
    if (!userUpdateSuccessful) {
      return res.status(500).json({
        message: Messages.SOMETHING_WENT_WRONG,
        statusCode: 500,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * This controller accepts a payload from the client, validates it, and creates
 * a new raise request using the `RequestService`. If any step fails, an
 * appropriate error response is returned. Otherwise, it responds with a success status.
 */
async function logoRequestController(req, res, next) {
  try {
    const requestService = new RequestService();
    const { error, value } = logoRequestPyaloadSchema.validate(req.body);
    if (error) {
      return res.status(422).json({
        message: error.message,
        statusCode: 422,
        error: STATUS_CODES[422],
      });
    }

    const raiseRequest = await requestService.createRaiseRequest(value);
    if (!raiseRequest) {
      return res.status(500).json({
        message: Messages.SOMETHING_WENT_WRONG,
        statusCode: 500,
        error: STATUS_CODES[500],
      });
    }

    return res.status(200).json({
      statusCode: 200,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserDataController,
  updateProfileController,
  deleteUserAccountController,
  generateKeyController,
  destroyKeyController,
  updatePasswordController,
  logoRequestController,
};
