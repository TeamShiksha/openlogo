const router = require("express").Router();
const signupController = require("../controllers/auth/signup");
const signinController = require("../controllers/auth/signin");
const signoutController = require("../controllers/auth/signout");

router.post("/signup", signupController);
router.post("/signin", signinController);
router.get("/signout", signoutController);

module.exports = router;