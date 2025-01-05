const router = require("express").Router();
const revertToCustomerController = require("../controllers/operator/revert");
const getOperatorDataController = require("../controllers/operator/data");
const authMiddleware = require("../middlewares/auth");

router.put(
  "/revert",
  authMiddleware({ operatorOnly: true }),
  revertToCustomerController,
);
router.get(
  "/",
  authMiddleware({ operatorOnly: true }),
  getOperatorDataController,
);

module.exports = router;
