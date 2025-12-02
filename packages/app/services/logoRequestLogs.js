const { LogoRequestLogsRepository } = require("../repositories");

class LogoRequestLogsService {
  constructor() {
    this.LogoRequestLogsRepository = new LogoRequestLogsRepository();
  }

  /**
   * Create a new API request record
   * @param {Object} requestData - The data for the new API request
   * @param {string} requestData.user_id - The ID of the user making the request
   * @param {string} requestData.key_id - The ID of the API key used for the request
   * @param {string} requestData.image_id - The ID of the image requested
   * @param {number} [requestData.response_size_bytes=0] - The size of the response in bytes
   * @returns {Promise<Object>} - The newly created API request object
   */
  async createEntry(requestData) {
    const newRequest = {
      user_id: requestData.user_id,
      key_id: requestData.key_id,
      image_id: requestData.image_id,
      response_size_bytes: requestData.response_size_bytes || 0,
    };
    return await this.LogoRequestLogsRepository.create(newRequest);
  }

  /**
   * Get Weekly API request statistics for a user.
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} - An object containing weekly statistics
   */
  async getWeeklyStats(userId) {
    return await this.LogoRequestLogsRepository.getCurrentWeekData(userId);
  }

  /**
   * Get Monthly API request statistics for a user.
   * @param {string} userId - The ID of the user
   * @returns {Promise<Object>} - An object containing monthly statistics
   */
  async getMonthlyStats(userId) {
    return await this.LogoRequestLogsRepository.getCurrentMonthData(userId);
  }
}

module.exports = LogoRequestLogsService;
