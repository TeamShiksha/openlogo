const RequestRepository = require("../repositories/Request");

class RequestService {
    constructor() {
        this.requestRepository = new RequestRepository();
    }
}

module.exports = RequestService;