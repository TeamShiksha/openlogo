const router = require("express").Router();
const cors = require("cors");
const operatorRouter = require("./operator");
const userRouter = require("./user");
const authRouter = require("./auth");
const businessRouter = require("./business");
const adminRouter = require("./admin");
const logger = require("../utils/logger");

const privateRouteCORS = {
  origin: (origin, callback) => {
    if (origin === process.env.CLIENT_PROXY_URL || !origin) {
      callback(null, true);
    } else {
      logger.error(
        `origin=${origin} and CLIENT_PROXY_URL=${process.env.CLIENT_PROXY_URL} do not match..`,
      );
      logger.error(
        "What is cors ? Learn here: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
      );
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

router.use("/operator", cors(privateRouteCORS), operatorRouter);
router.use("/user", cors(privateRouteCORS), userRouter);
router.use("/auth", cors(privateRouteCORS), authRouter);
router.use("/business", cors(), businessRouter);
router.use("/admin", cors(privateRouteCORS), adminRouter);

module.exports = router;
