const router = require("express").Router();
const operatorRouter = require("./operator");
const userRouter = require("./user");
const authRouter = require("./auth");
const businessRouter = require("./business")
const adminRouter = require("./admin");

/* const cors = require("cors"); */

/* const privateRouteCORS = {
    origin: (origin, callback) => {
      if (origin === process.env.CLIENT_PROXY_URL || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
}; */

router.use("/operator", operatorRouter);
router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use('/business', businessRouter);
router.use("/admin", adminRouter);

module.exports = router;



