const dotenv = require("dotenv");
const express = require("express");
const { validateEnv } = require("./utils/scripts/envSchema");
const logger = require("./utils/logger");

/* 
 * If the `NODE_ENV` is not test, we validate the environment variables.
 */
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
  const { error } = validateEnv(process.env);
  if (error) {
    console.log(`Config validation error: ${error.message}`);
    process.exit(1);
  }
}

const app = express();
app.disable("x-powered-by");
app.get("/", (req, res) => {
  res.json({ message: "Hello, this is your JSON response!" });
});

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
