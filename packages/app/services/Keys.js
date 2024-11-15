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
        if(keyIds.length === 0) {
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
}

module.exports = KeyService;