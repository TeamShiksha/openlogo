const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const { getApiStatsController } = require("../controllers/api_request");
const { UserType } = require("../utils/constants");

router.get(
  "/stats",
  authMiddleware({
    roles: [UserType.ADMIN, UserType.OPERATOR, UserType.CUSTOMER],
  }),
  getApiStatsController
);

module.exports = router;
