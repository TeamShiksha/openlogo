const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  addRequestController,
  getRequestsController,
  updateRequestController,
} = require("../controllers/request");

router.put(
  "/:requestId",
  // authMiddleware({ operatorOnly: true }),
  updateRequestController
);
router.get(
  "/",
  // authMiddleware({ operatorOnly: true }),
  getRequestsController
);
router.post("/", authMiddleware(), addRequestController);

module.exports = router;
