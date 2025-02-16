const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const {
  getUserDataController,
  updateProfileController,
  deleteUserAccountController,
  generateKeyController,
  destroyKeyController,
  updatePasswordController,
  logoRequestController,
} = require("../controllers/users");

router.get("/", authMiddleware(), getUserDataController);
router.patch("/", authMiddleware(), updateProfileController);
router.delete("/", authMiddleware(), deleteUserAccountController);
router.post("/api-key", authMiddleware(), generateKeyController);
router.delete("/api-key/:keyId", authMiddleware(), destroyKeyController);
router.put("/password", authMiddleware(), updatePasswordController);
router.post("/request", authMiddleware(), logoRequestController);

module.exports = router;
