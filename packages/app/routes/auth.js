const router = require("express").Router();
const signupController = require("../controllers/auth/signup");
const signinController = require("../controllers/auth/signin");

router.post("/signup", signupController);
router.post("/signin", signinController);

module.exports = router;