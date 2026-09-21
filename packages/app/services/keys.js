const { KeysRepository } = require("../repositories");

class KeyService {
  constructor() {
    this.keyRepository = new KeysRepository();
  }

  /**
   * Gets Key by Id.
   * @param {Array<string>} keyIds
   * @returns {Promise<Array<Object>>} - Key Object Array.
   */
  async getAllUserKeys(keyIds) {
    if (keyIds.length === 0) {
      return [];
    }
    const keys = await this.keyRepository.getMultipleKeys(keyIds);
    return keys.map((key) => key.data());
  }

  /**
   * Gets All Keys.
   * @returns {Promise<number>} - Total no of keys.
   */
  async getKeysCount() {
    return await this.keyRepository.getKeysCount();
  }

  /**
   * Create a New Key.
   * @param {Object} keyData - The key data object.
   * @returns {Promise<Object>} - Newly created Key.
   */
  async createNewKey(keyData) {
    return await this.keyRepository.create(keyData);
  }

  /**
   * Destroy a Key.
   * @param {string} keyId - The Key Id to destroy.
   * @returns {Promise<Object>} - The destroyed key object.
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
    const userWithSubscription =
      await this.keyRepository.fetchUserWithSubscription(apiKeys);
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

  /**
   * Checks if there exists a publishable key matching value
   * @param {string} publishableKey - publishable key string
   * @returns {Promise<Object|null>} - Key document or null
   **/
  async getPublishableKey(publishableKey) {
    const keyRef = await this.keyRepository.getPublishableKey(publishableKey);
    return keyRef;
  }

  /**
   * Gets a key document by ID.
   * @param {string} keyId - The Key ID.
   * @returns {Promise<Object|null>} - The key document or null.
   */
  async getKeyById(keyId) {
    return await this.keyRepository.getById(keyId);
  }

  /**
   * Updates a key document by ID.
   * @param {string} keyId - The Key ID.
   * @param {Object} updateData - Fields to update.
   * @returns {Promise<Object|null>} - Updated key document.
   */
  async updateKey(keyId, updateData) {
    return await this.keyRepository.update(keyId, updateData);
  }

  /**
   * Finds and updates keys associated with `keyId` that lack an `expires_at` property.
   * . Retrieves all keys for `keyId`.
   * . Filters for keys without an expiry time.
   * . If found, updates these keys via the repository.
   * @param {string} keyId - The ID used to retrieve keys.
   * @returns {Promise<Array<Object> | false>} Updated key objects if keys without expiry exist, otherwise `false`.
   **/

  async findUpdateKeyWithoutExpiry(keyId) {
    const allKeys = await this.keyRepository.getMultipleKeys(keyId);
    const keysWithoutExpiry = allKeys.filter((key) => !key.expires_at);
    if (keysWithoutExpiry.length > 0) {
      const keyIds = keysWithoutExpiry.map((key) => key._id);
      const keysUpdated = await this.keyRepository.updateOldKeys(keyIds);
      return keysUpdated;
    }
    return false;
  }
}

module.exports = KeyService;
