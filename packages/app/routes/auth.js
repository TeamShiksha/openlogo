const router = require("express").Router();
const signupController = require("../controllers/auth/signup");

router.post("/signup", signupController);

module.exports = router;