const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const generateKeyController = require("../controllers/user/generate");
const updateProfileController = require("../controllers/user/updateProfile");

/**
 * POST /generate
 * - Calls the `generateKeyController` to create a new key based on the request data.
 *
 * PATCH /update-profile
 * - Calls the `updateProfileController` to update the user's profile details.
 */
router.post("/generate", authMiddleware(), generateKeyController);
router.patch("/update-profile", authMiddleware(), updateProfileController);

module.exports = router;