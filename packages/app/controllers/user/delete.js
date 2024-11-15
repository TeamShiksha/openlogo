const UserService = require("../../services/User");

async function deleteUserAccountController(req, res, next) {
  try {
    const userService = new UserService();

    const { userId } = req.userData;
    await userService.deleteUserAccount(userId);
    
    res.status(200).json({
      status: 200,
      message: "Your user data has been successfully deleted from our system",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = deleteUserAccountController;