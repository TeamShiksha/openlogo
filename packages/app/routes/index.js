const router = require("express").Router();
const cors = require("cors");
const operatorRouter = require("./operator");
const userRouter = require("./users");
const authRouter = require("./auth");
const businessRouter = require("./logo");
const adminRouter = require("./catalog");
const { logoLimiter, baseLimiter } = require("../middlewares/rateLimiter");

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === process.env.CLIENT_PROXY_URL || !origin) {
      callback(null, true);
    } else {
      console.error(
        `origin=${origin} and CLIENT_PROXY_URL=${process.env.CLIENT_PROXY_URL} do not match..`
      );
      console.error(
        "What is cors ? Learn here: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

router.use("/messages", baseLimiter, cors(privateRouteCORS), operatorRouter);
router.use("/users/me", baseLimiter, cors(privateRouteCORS), userRouter);
router.use("/auth", baseLimiter, cors(privateRouteCORS), authRouter);
router.use("/logo", logoLimiter, cors(privateRouteCORS), businessRouter);
router.use("/catalog", baseLimiter, cors(privateRouteCORS), adminRouter);

module.exports = router;
