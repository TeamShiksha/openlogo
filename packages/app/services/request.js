const { RequestRepository } = require("../repositories");

class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
  }

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
