const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  getMessagesController,
  respondMessagesController,
} = require("../controllers/operator");

router.put(
  "/:messageId",
  authMiddleware({ operatorOnly: true }),
  respondMessagesController
);
router.get("/", authMiddleware({ operatorOnly: true }), getMessagesController);

module.exports = router;
