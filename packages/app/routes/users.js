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
} = require("../controllers/users");

router.get("/me", authMiddleware(), getUserDataController);
router.patch("/me", authMiddleware(), updateProfileController);
router.delete("/me", authMiddleware(), deleteUserAccountController);
router.post("/api-key", authMiddleware(), generateKeyController);
router.delete("/api-key/:keyId", authMiddleware(), destroyKeyController);
router.put("/password", authMiddleware(), updatePasswordController);
router.post("/request", authMiddleware(), logoRequestController);
router.get("/update-oldKeys", authMiddleware(), updateOldKeysController);
module.exports = router;
