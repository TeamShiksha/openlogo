const { STATUS_CODES } = require("http");
const UserService = require("../../services/User");
const KeyService = require("../../services/Keys");
const SubscriptionService = require("../../services/Subscription");

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
        message: "User document not found",
      });
    }

    const data = {};

    const [subscriptionData, userKeys] = await Promise.allSettled([subscriptionService.getSubscription(user.subscription_id), 
        keyService.getAllUserKeys(user.keys)]);
    Object.assign(data, user.data());

    let statusCode = 200;
    if(subscriptionData.status === "fulfilled" && subscriptionData.value) {
      Object.assign(data, { subscription: subscriptionData.value });
    } else {
      statusCode = 206;
    }
    if(userKeys.status === "fulfilled" && userKeys.value) {
      Object.assign(data, { keys: userKeys.value});
    } else {
      statusCode = 206;
    }

    return res.status(statusCode).json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports =  getUserDataController;