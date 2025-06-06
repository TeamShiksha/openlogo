const { RequestRepository } = require("../repositories");

class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
  }

  /**
   * Create a new raise request
   * @param {Object} formData - The data for the new request
   * @param {string} formData.user_id - The ID of the user making the request
   * @param {string} formData.companyUrl - The URL of the company
   * @returns {Promise<Object>} - The newly created request object
   * @throws {Error} - Throws an error if request creation fails
   */
  async createRaiseRequest(formData) {
    const newRaiseRequest = await this.requestRepository.create({
      user_id: formData.user_id,
      companyUrl: formData.companyUrl,
      comment: null,
      operator: null,
    });
    return newRaiseRequest;
  }

  /**
   * @returns {Promise<number>} - Returns a promise with total no of requests.
   */
  async getRequestsCount() {
    return await this.requestRepository.getRequestsCount();
  }

  /**
   * @returns {Promise<number>} - Returns a promise with total no of hits.
   */
  async getHitsCount() {
    return await this.requestRepository.getHitsCount();
  }
}

module.exports = RequestService;
