const winston = require("winston");
const NewRelicTransport = require("newrelic-winston-transport");

/*
 * Winston logger is created and configured to log error-level messages in JSON format with timestamps.
*/
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
});

/*
 * This configuration adds New Relic transport for error-level logging if environment is production,
 * otherwise, logs to the console in a simple format.
*/
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