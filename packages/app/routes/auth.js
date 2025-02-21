const router = require("express").Router();
const {
  signupController,
  signinController,
  signoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordSessionController,
  resetPasswordController,
} = require("../controllers/auth");

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/signout", signoutController);
router.get("/verify/:token", verifyEmailController);
router.post("/password/forgot", forgotPasswordController);
router.get("/password/forgot/:token", resetPasswordSessionController);
router.patch("/password/reset", resetPasswordController);

module.exports = router;
