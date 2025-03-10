const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: "draft-8", //  eigth draft of the IETF rate limit header specification
  legacyHeaders: false,
});

module.exports = limiter;
