const RequestRepository = require("../repositories/Request");

class RequestService {
  constructor() {
    this.requestRepository = new RequestRepository();
  }

  async createRaiseRequest(formData) {
    const newRaiseRequest = this.requestRepository.create({
      user_id: formData.user_id,
      companyUrl: formData.companyUrl,
      comment: null,
      operator: null,
    });
    return newRaiseRequest;
  }
}

module.exports = RequestService;
