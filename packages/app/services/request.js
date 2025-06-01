const { RequestRepository } = require("../repositories");
const { StatusTypes } = require("../utils/constants");

class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
  }

  /**
   * checks if a Pending request already exists for the given userId.
   * @param {string} userId - The ID of the requested user
   * @returns {boolean} - Returns 'true' if an active request exists for the userId, otherwise 'false'.
   */
  async requestExistsForUser(userId) {
    const request = await this.requestRepository.findByUserAndStatus(
      userId,
      StatusTypes.PENDING
    );
    return !!request;
  }

  // async urlAlreadyExists(companyUrl){

  // }

  /**
   * checks if a Pending request exists for the given company Url.
   * @param {string} companyUrl - the requested company url
   * @returns {boolean} - Returns 'true' if a Pending request exists for the companyUrl, otherwise false.
   */
  async requestExistsForCompanyUrl(companyUrl) {
    const request = await this.requestRepository.findByCompanyUrlAndStatus(
      companyUrl,
      StatusTypes.PENDING
    );
    return !!request;
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

  /** Retrieves the total number of requests
   * @returns {Promise<number>} - Returns a promise with total no of requests.
   */
  async getRequestsCount() {
    return await this.requestRepository.getRequestsCount();
  }
  /**
   * fetches list of requests
   * @param {number} page - number of pages
   * @param {number} limit - number of requests per page
   * @returns {Promise<Object>} returns a list of requests or null if no requests exists
   */
  async getPaginatedRequests(page, limit, tab) {
    return await this.requestRepository.getAll(page, limit, tab);
  }

  /** Retrieves the total number of resolved requests
   * @returns {Promise<number>} - Returns a promise with total no of hits.
   */
  async getHitsCount() {
    return await this.requestRepository.getHitsCount();
  }

  /**
   * Retrieves request by ID.
   * @param {string} requestId - The ID of the request
   * @returns {Object} - The request object, or null if request doesn't exist.
   */
  async getRequestById(requestId) {
    return await this.requestRepository.getById(requestId);
  }

  /**
   * Responds to a request by updating status and comment
   * @param {string} requestId - The ID of the request
   * @param {string} operatorId - The ID of the user resolving request
   * @param {string} status - The status for the request provided by the operator
   * @param {string} comment - The commnet for the request provided by the operator
   * @return {Object} - An object containing the updated request Data or a flag if already replied
   */
  async respondToRequest(requestId, operatorId, status, comment) {
    const currentRequest = await this.requestRepository.getById(requestId);
    if (currentRequest.status === "RESOLVED") {
      return { alreadyProcessed: true };
    }
    const updatedData = {
      comment,
      status,
      operator: operatorId,
      closedAt: new Date(),
    };
    const result = await this.requestRepository.updateRequestStatus(
      requestId,
      updatedData
    );
    if (result.modifiedCount === 0) throw new Error("MongoDB operation failed");
    const updatedRequest = await this.requestRepository.getById(requestId);
    return {
      companyUrl: updatedRequest.companyUrl,
      status: updatedRequest.status,
      comment: updatedRequest.comment,
      openedAt: updatedRequest.openedAt,
      closedAt: updatedRequest.closedAt,
    };
  }
}

module.exports = RequestService;
