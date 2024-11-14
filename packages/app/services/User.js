const UserRepository = require("../repositories/Users");
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    /**
     * Gets User by Id.
     * @param {string} userId - The userId of the user.
     * @returns {Object} - User Object.
    */
    async getUser(userId) {
        return await this.userRepository.getById(userId);
    }

    /**
     * Update User by Id.
     * @param {string, string} {firstName, lastName} - First and Last Name of the User.
     * @param {string} userId - The userId of the user.
     * @returns {boolean} - True if User Details are updated successfully else false.
     */
    async updateUserById({ firstName, lastName }, userId) {
        const updatedUser = UserRepository.update(userId, { firstName, lastName });
        if(updatedUser == null) {
            return false;
        }
        return true;
    }

    /**
   * Finds a user by their email address.
   * @param {string} email - The email address to search for.
   * @returns {Promise<Object>} - The user document if found, otherwise null.
   */
    async getUserByEmail(email) {
        return UserRepository.findByEmail(email);
    }
}

module.exports = UserService;