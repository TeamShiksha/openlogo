const winston = require("winston");
const NewRelicTransport = require("newrelic-winston-transport");
const { combine, timestamp, printf, colorize, align } = winston.format;

/*
 * Creating object for winston logger and customizing the output format.
 */
const logger = winston.createLogger({
  level: "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`),
  ),
});

/*
 * Add newrelic transporter for logs only if the environment is
 * production otherwise, logs to the console.
 */
if (process.env.NODE_ENV === "prod") {
  logger.add(new NewRelicTransport());
} else {
  logger.add(new winston.transports.Console());
}

module.exports = logger;
