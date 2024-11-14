const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");
const generateKeyController = require("../controllers/user/generate");

/**
 * The routes for the User Controller
 * 1. /generate -> Generates a New User Key
 */
router.post("/generate", authMiddleware(), generateKeyController);

module.exports = router;