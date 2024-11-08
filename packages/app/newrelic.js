"use strict";
require("dotenv").config();

const appName = process.env.NEW_RELIC_APP_NAME || "LogoExecutive";
const licenseKey = process.env.NEW_RELIC_LICENSE_KEY;

if (!licenseKey) {
  console.warn("New Relic license key not found. New Relic monitoring will be disabled.");
}

exports.config = {
  app_name: appName,
  license_key: licenseKey,
  logging: {
    level: "error",
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
    enabled: true
  }
};