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

if (process.env.NODE_ENV === "prod") {
  logger.add(new NewRelicTransport({
    level: "error",
  }));
} else {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;