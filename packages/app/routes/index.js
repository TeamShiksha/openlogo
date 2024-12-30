const router = require("express").Router();
const cors = require("cors");
const operatorRouter = require("./operator");
const userRouter = require("./user");
const authRouter = require("./auth");

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === process.env.CLIENT_PROXY_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

router.use("/operator", cors(privateRouteCORS), operatorRouter);
router.use("/user", cors(privateRouteCORS), userRouter);
router.use("/auth", cors(privateRouteCORS), authRouter);

module.exports = router;