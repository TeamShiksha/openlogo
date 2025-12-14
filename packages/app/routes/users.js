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
  updateOldKeysController,
  downloadUserData,
} = require("../controllers/users");

router.get("/me", authMiddleware(), getUserDataController);
router.patch("/me", authMiddleware(), updateProfileController);
router.delete("/me", authMiddleware(), deleteUserAccountController);
router.post("/api-key", authMiddleware(), generateKeyController);
router.delete("/api-key/:keyId", authMiddleware(), destroyKeyController);
router.put("/password", authMiddleware(), updatePasswordController);
router.post("/request", authMiddleware(), logoRequestController);
router.get("/update-old-keys", authMiddleware(), updateOldKeysController);
router.get("/download", authMiddleware(), downloadUserData);

module.exports = router;
