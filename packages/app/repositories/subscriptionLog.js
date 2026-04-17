const BaseRepository = require("./base");
const SubscriptionLog = require("../models/subscriptionLog");

class SubscriptionLogRepository extends BaseRepository {
  constructor() {
    super(SubscriptionLog);
  }
}

module.exports = SubscriptionLogRepository;
