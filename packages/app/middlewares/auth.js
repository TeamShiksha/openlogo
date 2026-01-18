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

      const { userId: user } = validateSession;

      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        userId: user._id,
        is_verified: user.is_verified,
        subscription_id: user.subscription_id,
        created_at: user.createdAt,
        is_deleted: user.is_deleted,
        updated_at: user.updatedAt,
      };

      if (
        (options.adminOnly && user.role !== UserType.ADMIN) ||
        (options.operatorOnly && user.role !== UserType.OPERATOR) ||
        (options.customerOnly && user.role !== UserType.CUSTOMER) ||
        (options.roles && !options.roles.includes(user.role))
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
