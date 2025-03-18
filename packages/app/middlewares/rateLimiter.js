const rateLimit = require("express-rate-limit");

const logoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100,
  standardHeaders: "draft-8", //  eigth draft of the IETF rate limit header specification
  legacyHeaders: false,
});

const baseLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 60,
  standardHeaders: "draft-8", //  eigth draft of the IETF rate limit header specification
  legacyHeaders: false,
});

module.exports = { logoLimiter, baseLimiter };
