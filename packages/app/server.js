const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const { validateEnv } = require("./utils/envSchema");
const routes = require("./routes/index");

/**
 * Load environmental variables only if `NODE_ENV` is not "test"
 */
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
  const { error } = validateEnv(process.env);
  if (error) {
    console.log(`Config validation error: ${error.message}`);
    process.exit(1);
  }
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.info("Connected to mongodb.."))
    .catch((err) => {
      console.error("Mongodb connection error:", err.message);
      process.exit(1);
    });
}

const app = express();
app.use(cookieParser());
app.disable("x-powered-by");
// Trust first proxy (needed for correct client IP when behind load balancer / reverse proxy)
// Ensures req.ip is accurate for rate limiting, logging, etc.
app.set("trust proxy", 1);
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/", routes);
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.error(`Server is running on http://localhost:${PORT}..`);
  });
}

module.exports = app;
