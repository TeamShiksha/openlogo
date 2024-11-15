const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const generateKeyController = require("../controllers/user/generate");
const updateProfileController = require("../controllers/user/updateProfile");
const updatePasswordController = require("../controllers/user/update-password");
const destroyKeyController = require("../controllers/user/destroy");
const deleteUserAccountController = require("../controllers/user/delete");

/**
 * POST /generate
 * - Calls the `generateKeyController` to create a new key based on the request data.
 *
 * PATCH /update-profile
 * - Calls the `updateProfileController` to update the user's profile details.
 * 
 * POST /update-password
 * - Calls the `updatePasswordController` to update user password.
 * 
 * DELETE /destroy
 * - Calls the `destroyKeyController` to delete a User Key.
 * 
 * DELETE /delete
 * - Calls the `deleteUserAccountController` to delete a User Account.
 */
router.post("/generate", authMiddleware(), generateKeyController);
router.patch("/update-profile", authMiddleware(), updateProfileController);
router.post("/update-password", authMiddleware(), updatePasswordController);
router.delete("/destroy", authMiddleware(), destroyKeyController);
router.delete("/delete", authMiddleware(), deleteUserAccountController);

module.exports = router;