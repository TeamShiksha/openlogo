const router = require("express").Router();
const signupController = require("../controllers/auth/signup");
const signinController = require("../controllers/auth/signin");
const signoutController = require("../controllers/auth/signout");
const verifyTokenController = require("../controllers/auth/verify");
const forgotPasswordController = require("../controllers/auth/forgot-password");
const ResetPasswordController = require("../controllers/auth/reset-password");

router.post("/signup", signupController);
router.post("/signin", signinController);
router.get("/signout", signoutController);
router.get("/verify", verifyTokenController);
router.post("/forgot-password", forgotPasswordController);
router.get("/reset-password", ResetPasswordController.get);
router.patch("/reset-password", ResetPasswordController.patch);

module.exports = router;
