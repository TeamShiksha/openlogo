const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  addRequestController,
  getRequestsController,
  updateRequestController,
} = require("../controllers/request");
const { UserType } = require("../utils/constants");

router.put(
  "/:requestId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  updateRequestController
);
router.get(
  "/",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getRequestsController
);
router.post("/", authMiddleware({ customerOnly: true }), addRequestController);

module.exports = router;
