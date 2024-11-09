const dotenv = require("dotenv");
const express = require("express");
const { validateEnv } = require("./utils/scripts/envSchema");
const logger = require("./utils/logger");

/* 
 * Load environmental variables only if `NODE_ENV` is not "test"
 */
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
  require("newrelic");
  const { error } = validateEnv(process.env);
  if (error) {
    console.log(`Config validation error: ${error.message}`);
    process.exit(1);
  }
}

const app = express();
app.disable("x-powered-by");

/*
 * Defines the format of the error message for ingestion on the `finish` event of the response object (res). 
 * This event is emitted when the response has been fully sent to the client.
*/
app.use((req, res, next) => {
  res.on('finish', () => {
    logger.error(`${req.method} ${req.originalUrl} ${res.statusCode} - ${res.statusMessage}`);
  });
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
