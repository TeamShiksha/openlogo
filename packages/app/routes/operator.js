const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  getMessagesController,
  respondMessagesController,
  addMessagesController,
} = require("../controllers/operator");
const { UserType } = require("../utils/constants");

router.put(
  "/:messageId",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  respondMessagesController
);
router.get(
  "/",
  authMiddleware({ roles: [UserType.ADMIN, UserType.OPERATOR] }),
  getMessagesController
);
router.post("/contact-us", addMessagesController);

module.exports = router;
