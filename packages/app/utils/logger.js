const winston = require("winston");
const NewRelicTransport = require("newrelic-winston-transport");
require("dotenv").config();

const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

if (process.env.NEW_RELIC_LOG_ENABLED === "true") {
  logger.add(new NewRelicTransport({
    level: "error",
  }));
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;