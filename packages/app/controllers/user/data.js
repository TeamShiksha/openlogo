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
        message: "User not found",
      });
    }

    const data = {};
    const subscriptionData = await subscriptionService.getSubscription(user.subscription_id);
    const keysData = await keyService.getAllUserKeys(user.keys);
    if (!keysData || !subscriptionData) {
        return res.status(206).json({
            statusCode: 206,
            error: STATUS_CODES[206],
            message: "User Data not found"
        });
    }

    Object.assign(data, user.data(), { subscription: subscriptionData, keys: keysData });
    return res.status(200).json({ 
        statusCode: 200,
        data 
    });
  } catch (err) {
    next(err);
  }
}

module.exports =  getUserDataController;