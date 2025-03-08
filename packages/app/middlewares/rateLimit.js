const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

module.exports = limiter;
