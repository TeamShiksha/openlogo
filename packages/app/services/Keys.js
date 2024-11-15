const KeysRepository = require("../repositories/Keys");

class KeyServices {
  constructor() {
    this.keysRepository = new KeysRepository();
  }

  /**
   * Fetches a user with their subscription details based on a provided API key
   * @param {string} apiKeys - key uuid
   * @returns {Promise<Object>} - Returns the user along with subscription details
   */
  async fetchUserWithSubscription(apiKeys) {
    try {
      const userWithSubscription = await this.keysRepository.fetchUserWithSubscription(apiKeys);
      return userWithSubscription;
    } catch (error) {
      throw error
    }
  }

  /**
   * Checks if there exists a key with matching key value
   * @param {string} apiKey - key uuid()
   * @returns {Promise<boolean>} - True if key exists, otherwise false
   **/
  async isAPIKeyPresent(apiKey) {
    try {
      const apiKeys = await this.keysRepository.isAPIKeyPresent(apiKey);
      return apiKeys.length > 0;
    } catch (error) {
      throw error
    }
  }

  /**
   * Fetches user by API key
   * @param {string} apiKey of user
   * @returns {Promise<Object>} - User details
   **/
  async fetchUser(apiKey) {
    try {
      const key = await this.keysRepository.fetchUser(apiKey);
      if (!key) return null;
      return key.user.toString();
    } catch (error) {
      throw error
    }
  }
}

module.exports = KeyServices;
