const JWT = require("jsonwebtoken");
const { STATUS_CODES } = require("http");
const { UserType } = require("../utils/constants");
/**
 * @param {Object} options
 * @param {boolean} options.adminOnly
 **/
module.exports = (options = {}) => {
  return function (req, res, next) {
    try {
      const { jwt } = req.cookies;
      if (process.env.NODE_ENV !== "production") {
        const maskedJwt = jwt ? `${jwt.slice(0, 5)}...${jwt.slice(-5)}` : "undefined";
        console.log("JWT from cookies (masked):", maskedJwt);
      }
      if (!jwt) {
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Invalid credentials",
          statusCode: 401,
        });
      }
      const decodedData = JWT.verify(jwt, process.env.JWT_SECRET);
      const { data } = decodedData;

      if (!data || !data.email || !data.userId)
        return res.status(403).json({
          error: STATUS_CODES[403],
          message: "Invalid credentials",
          statusCode: 403,
        });
      if (
        (options.adminOnly && data.role !== UserType.ADMIN) ||
        (options.operatorOnly && data.role !== UserType.OPERATOR) ||
        (options.customerOnly && data.role !== UserType.CUSTOMER) ||
        (options.roles && !options.roles.includes(data.role))
      )
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Unauthorized",
          statusCode: 401,
        });

      Object.assign(req, { userData: decodedData.data });
      next();
    } catch (err) {
      next(err);
    }
  };
};
