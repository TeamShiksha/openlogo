const { STATUS_CODES } = require("http");
const UserSessionService = require("../services/userSession");
const { UserType, SESSION_ID_REGEX } = require("../utils/constants");

/**
 * @param {Object} options
 * @param {boolean} options.adminOnly
 **/

module.exports = (options = {}) => {
  return async function (req, res, next) {
    try {
      const userSessionService = new UserSessionService();
      const sessionId = req.cookies?.sessionId;

      if (
        !sessionId ||
        typeof sessionId !== "string" ||
        !SESSION_ID_REGEX.test(sessionId)
      ) {
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Invalid credentials",
          statusCode: 401,
        });
      }

      const validateSession =
        await userSessionService.validateSession(sessionId);

      if (!validateSession || !validateSession?.userId) {
        return res.status(401).json({
          error: STATUS_CODES[403],
          message: "Invalid credentials",
          statusCode: 403,
        });
      }

      const user = validateSession?.userId;

      if (user.is_deleted) {
        await userSessionService.signout(sessionId);
        return res.status(401).json({
          error: STATUS_CODES[401],
          message: "Account inactive",
          statusCode: 401,
        });
      }

      const userData = {
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
        subscription_id: user.subscription_id
          ? user.subscription_id.toString()
          : null,
        is_deleted: user.is_deleted,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };

      if (
        (options.adminOnly && userData.role !== UserType.ADMIN) ||
        (options.operatorOnly && userData.role !== UserType.OPERATOR) ||
        (options.customerOnly && userData.role !== UserType.CUSTOMER) ||
        (options.roles && !options.roles.includes(userData.role))
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
