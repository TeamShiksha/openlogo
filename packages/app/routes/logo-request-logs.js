const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  getLogoRequestStatsController,
} = require("../controllers/logo-request-logs");
const { UserType } = require("../utils/constants");

router.get(
  "/stats",
  authMiddleware({
    roles: [UserType.ADMIN, UserType.OPERATOR, UserType.CUSTOMER],
  }),
  getLogoRequestStatsController
);

module.exports = router;
