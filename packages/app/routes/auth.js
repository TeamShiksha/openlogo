const router = require("express").Router();
const authMiddleware = require("../middlewares/auth");

const {
  signupController,
  signinController,
  signoutController,
  verifyEmailController,
  forgotPasswordController,
  resendVerficationController,
  resetPasswordSessionController,
  resetPasswordController,
  validateSessionController,
} = require("../controllers/auth");

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/signout", signoutController);
router.get("/verify/:token?", verifyEmailController);
router.post("/resend-verification", resendVerficationController);
router.post("/password/forgot", forgotPasswordController);
router.get("/password/forgot/:token?", resetPasswordSessionController);
router.patch("/password/reset", resetPasswordController);
router.get("/validate-session", authMiddleware(), validateSessionController);

module.exports = router;
