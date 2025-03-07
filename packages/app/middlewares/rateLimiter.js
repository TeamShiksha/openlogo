/**
 * rate limiter middleware
 * @param {number} maxRequest - Maximum requests allowed in the time window
 * @param {number} timeLimit - Time window in milliseconds
 * @returns {function} Express middleware function
 */
function createApiLimiter(maxRequest = 100, timeLimit = 1000 * 60) {
  const requestData = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of requestData.entries()) {
      if (now - data.requestStartTime > timeLimit) {
        requestData.delete(ip);
      }
    }
  }, timeLimit);

  return function apiRateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (
      !requestData.has(ip) ||
      now - requestData.get(ip).requestStartTime > timeLimit
    ) {
      requestData.set(ip, {
        requestStartTime: now,
        count: 1,
      });

      res.setHeader("X-RateLimit-Limit", maxRequest);
      res.setHeader("X-RateLimit-Remaining", maxRequest - 1);
      res.setHeader(
        "X-RateLimit-Reset",
        new Date(now + timeLimit).getTime() / 1000
      ); // seconds

      return next();
    }

    const data = requestData.get(ip);

    if (data.count >= maxRequest) {
      res.setHeader(
        "Retry-After",
        Math.ceil((data.requestStartTime + timeLimit - now) / 1000)
      );
      return res.status(429).json({
        error: "Too Many Requests",
        message: `You have exceeded the ${maxRequest} requests in ${timeLimit / 1000} seconds limit!`,
      });
    }

    data.count++;

    requestData.set(ip, data);

    res.setHeader("X-RateLimit-Limit", maxRequest);
    res.setHeader("X-RateLimit-Remaining", maxRequest - data.count);
    res.setHeader(
      "X-RateLimit-Reset",
      new Date(now + timeLimit).getTime() / 1000
    ); // seconds

    next();
  };
}

module.exports = createApiLimiter;
