const KeyRepository = require("../repositories/Keys");

class KeyService {
  constructor() {
    this.keyRepository = new KeyRepository();
  }

  /**
 * Gets Key by Id.
 * @param {string} keyId
 * @returns {Object} - Key Object.
 */
  async getAllUserKeys(keyIds) {
    if (keyIds.length === 0) {
      return [];
    }
    return await this.keyRepository.getMultipleKeys(keyIds);
  }

  /**
 * Create a New Key.
 * @param {string} keyDescription - The Key Description of the user.
 * @returns {Object} - Newly created Key.
 */
  async createNewKey(keyDescription) {
    return await this.keyRepository.create(keyDescription);
  }

  /**
 * Destroy a Key.
 * @param {string} keyId - The Key Id to destroy.
 * @returns {Object} - The destroyed key object.
 */
  async destroyKey(keyId) {
    return await this.keyRepository.delete(keyId);
  }

  /**
   * Fetches a user with their subscription details based on a provided API key
   * @param {string} apiKeys - key uuid
   * @returns {Promise<Object>} - Returns the user along with subscription details
   */
  async fetchUserWithSubscription(apiKeys) {
    const userWithSubscription = await this.keyRepository.fetchUserWithSubscription(apiKeys);
    return userWithSubscription;

  }

  /**
   * Checks if there exists a key with matching key value
   * @param {string} apiKey - key uuid()
   * @returns {Promise<boolean>} - True if key exists, otherwise false
   **/
  async getApiKey(apiKey) {
    const keyRef = await this.keyRepository.getApiKey(apiKey);
    return keyRef;
  }
}

module.exports = KeyService; 
