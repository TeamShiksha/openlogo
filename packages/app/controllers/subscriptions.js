const { STATUS_CODES } = require("http");
const mongoose = require("mongoose");
const { Messages } = require("../utils/constants");
const { changeSubscriptionPlanSchema } = require("../schemas/admin");
const SubscriptionService = require("../services/subscriptions");
const UsersService = require("../services/users");

/**
 * PATCH /api/admin/users/:userId/subscription
 * Admin-only: upgrade or downgrade a user's subscription plan.
 */
async function changeSubscriptionPlanController(req, res, next) {
  try {
    const subscriptionService = new SubscriptionService();
    const usersService = new UsersService();

    const { error, value } = changeSubscriptionPlanSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(422).json({
        statusCode: 422,
        error: STATUS_CODES[422],
        message: error.details.map((d) => d.message).join(", "),
      });
    }

    const { plan, reason } = value;
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        statusCode: 400,
        error: STATUS_CODES[400],
        message: Messages.INVALID_USER_ID,
      });
    }

    const user = await usersService.getUser(userId);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: Messages.USER_NOT_FOUND,
      });
    }

    const subscription = await subscriptionService.getSubscription(
      user.subscription_id
    );
    if (!subscription) {
      return res.status(404).json({
        statusCode: 404,
        error: STATUS_CODES[404],
        message: "Subscription not found.",
      });
    }

    if (subscription.type === plan) {
      return res.status(400).json({
        statusCode: 400,
        error: STATUS_CODES[400],
        message: Messages.PLAN_ALREADY_ACTIVE,
      });
    }

    const updatedSubscription =
      await subscriptionService.changeSubscriptionPlan(
        user.subscription_id,
        plan
      );

    if (plan !== "HOBBY") {
      await subscriptionService.createSubscriptionLog({
        user_id: user._id,
        changed_by: req.userData.userId,
        ...(reason && { reason }),
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: Messages.PLAN_CHANGE_SUCCESS,
      data: updatedSubscription,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { changeSubscriptionPlanController };
