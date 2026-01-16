const { STATUS_CODES } = require("http");
const UserSessionService = require("../services/userSession");
const { UserType } = require("../utils/constants");

/**
 * @param {Object} options
 * @param {boolean} options.adminOnly
 **/

module.exports = (options = {}) => {
  return async function (req, res, next) {
    try {
      const userSessionService = new UserSessionService();
      const { sessionId } = req.cookies;
      if (!sessionId) {
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Invalid credentials",
          statusCode: 401,
        });
      }

      const validateSession =
        await userSessionService.validateSession(sessionId);

      if (!validateSession) {
        return res.status(401).json({
          error: STATUS_CODES[403],
          message: "Invalid credentials",
          statusCode: 403,
        });
      }

      const { userId } = validateSession;

      const userData = {
        name: userId.name,
        email: userId.email,
        role: userId.role,
        userId: userId._id,
        is_verified: userId.is_verified,
        subscription_id: userId.subscription_id,
        created_at: userId.createdAt,
        is_deleted: userId.is_deleted,
        updated_at: userId.updatedAt,
      };

      if (
        (options.adminOnly && userId.role !== UserType.ADMIN) ||
        (options.operatorOnly && userId.role !== UserType.OPERATOR) ||
        (options.customerOnly && userId.role !== UserType.CUSTOMER) ||
        (options.roles && !options.roles.includes(userId.role))
      )
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Unauthorized",
          statusCode: 401,
        });

      Object.assign(req, { userData });
      next();
    } catch (err) {
      next(err);
    }
  };
};
