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
  async getAllRequests() {
    return await this.requestRepository.getAllRequests();
  }

  /**
   * @returns {Promise<number>} - Returns a promise with total no of hits.
   */
  async getAllHits() {
    return await this.requestRepository.getAllHits();
  }
}

module.exports = RequestService;
