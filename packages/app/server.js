const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./utils/swagger");
const { validateEnv } = require("./utils/envSchema");
const logger = require("./utils/logger");
const routes = require("./routes/index");

/**
 * Load environmental variables only if `NODE_ENV` is not "test"
 * Also load newrelic and connect to database
 */
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
  require("newrelic");
  const { error } = validateEnv(process.env);
  if (error) {
    logger.error(`Config validation error: ${error.message}`);
    process.exit(1);
  }
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => logger.info("Connected to mongodb.."))
    .catch((err) => {
      logger.error("Mongodb connection error:", err.message);
      process.exit(1);
    });
}

const app = express();
app.use(cookieParser());
app.disable("x-powered-by");
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/", routes);

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}..`);
  });
}

module.exports = app;
