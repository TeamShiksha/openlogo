const router = require("express").Router();
const authMiddleware = require("../../middlewares/auth");
const {
  changeSubscriptionPlanController,
} = require("../../controllers/subscriptions");

/**
 * PATCH /api/admin/users/:userId/subscription
 * Admin-only: upgrade or downgrade a user's subscription plan.
 */
router.patch(
  "/:userId/subscription",
  authMiddleware({ adminOnly: true }),
  changeSubscriptionPlanController
);

module.exports = router;
