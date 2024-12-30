const UserService = require("../../services/User");

/**
 * This controller retrieves the user's ID from `req.userData`, invokes the 
 * `deleteUserAccount` method from the `UserService` to remove the user account 
 * from the system, and responds with a success status if the operation completes 
 * without errors.
 */
async function deleteUserAccountController(req, res, next) {
  try {
    const userService = new UserService();
    const { userId } = req.userData;
    await userService.deleteUserAccount(userId);
    res.status(200).json({
      status: 200
    });
  } catch (err) {
    next(err);
  }
}

module.exports = deleteUserAccountController;