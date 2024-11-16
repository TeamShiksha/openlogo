const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const generateKeyController = require("../controllers/user/generate");
const updateProfileController = require("../controllers/user/updateProfile");
const updatePasswordController = require("../controllers/user/update-password");
const destroyKeyController = require("../controllers/user/destroy");
const deleteUserAccountController = require("../controllers/user/delete");
const getUserDataController = require("../controllers/user/data");

router.post("/key", authMiddleware(), generateKeyController);
router.delete("/key", authMiddleware(), destroyKeyController);
router.patch("/", authMiddleware(), updateProfileController);
router.put("/", authMiddleware(), updatePasswordController);
router.delete("/", authMiddleware(), deleteUserAccountController);
router.get("/", authMiddleware(), getUserDataController);

module.exports = router;