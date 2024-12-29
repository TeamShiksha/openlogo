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
      console.error(`Blocked by CORS: ${origin}`); 
      callback(new Error(`CORS error: ${origin} is not allowed.`));
    }
  },
  credentials: true,
};
// Apply CORS to specific routes
router.use("/operator", cors(privateRouteCORS), operatorRouter);
router.use("/user", cors(privateRouteCORS), userRouter);
router.use("/auth", cors(privateRouteCORS), authRouter);

module.exports = router;