const appName = process.env.NEW_RELIC_APP_NAME || "OpenLogo";
const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;

/*
 * This configuration will be used when newrelic is imported in `index.js`
 */
exports.config = {
  app_name: appName,
  license_key: licenseKey,
  logging: {
    level: "info",
    enabled: true,
  },
  application_logging: {
    enabled: true,
    forwarding: {
      enabled: true,
    },
    metrics: {
      enabled: true,
    },
  },
  distributed_tracing: {
    enabled: true,
  },
};
