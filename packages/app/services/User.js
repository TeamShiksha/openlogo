const UserRepository = require("../repositories/Users");
const KeyService = require("../services/Keys");
class UserService {
    constructor() {
        this.userRepository = new UserRepository();
        this.keyService = new KeyService();
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
     * Update User by userId.
     * @param {string, string} {firstName, lastName} - First and Last Name of the User.
     * @param {String} userId - The userId of the user.
     * @returns {boolean} - True if User Details are updated successfully else false.
     */
    async updateUser(updatedName, userId) {
        const updatedData  = {
            name: updatedName
        };
        const updatedUser = await this.userRepository.update(userId, updatedData);
        if(updatedUser == null) {
            return false;
        }
        return true;
    }

    /**
     * Creates a new user key and updates the user's key list.
     *
     * @param {Object} newKey - The new key details to be created.
     * @param {Object} user - The user object to which the new key should be associated.
     * @returns {Object|null} - Returns the created key object on success, or null if creation failed.
     * @throws {Error} - Throws an error if the key creation or user update fails.
     */
    async createNewUserKey(newKey, user) {
        const newUserKey = await this.keyService.createNewKey(newKey);
        user.keys.push(newUserKey._id);
        await user.save();
        return newUserKey;
    }    

    /**
     * Updates the user's password and saves the changes to the database.
     * @param {Object} user - The user object whose password is to be updated.
     * @param {string} hashNewPassword - The new hashed password to replace the existing one.
     * @returns {boolean} - Returns `true` if the password was successfully updated, otherwise `false`.
     */
    async updateUserPassword(user, hashNewPassword) {
        user.password = hashNewPassword;
        user.updated_at = Date.now();
        const updatedUser = await user.save();
        return updatedUser ? true : false;
    };

    /**
   * Destroy a User Key.
   * @param {string} keyId - The Key Id to destroy.
   * @param {string} user - The user Object.
   * @returns {boolean} - true if key was successfully destroyed.
   */
    async destroyUserKey(keyId, user) {
        const destroyedKey = await this.keyService.destroyKey(keyId);
        if(destroyedKey) {
            user.keys.pull(destroyedKey._id);
            await user.save();
        }
        return destroyedKey;
    }

    /**
   * Delete a User Account.
   * @param {string} userId - The user id to delete.
   * @returns {boolean} - true if user was successfully deleted.
   */
    async deleteUserAccount(userId) {
        const deletedUser = await this.userRepository.delete(userId);
        return deletedUser ? true : false;
    }
}

module.exports = UserService;