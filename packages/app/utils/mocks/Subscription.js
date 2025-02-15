const { SubscriptionTypes } = require("../constants");
const mongoose = require("mongoose");

const mockSubscriptions = [
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.HOBBY,
    key_limit: 2,
    is_active: true,
    usage_limit: 5000,
    usage_count: 0,
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.PRO,
    key_limit: 5,
    is_active: true,
    usage_limit: 15000,
    usage_count: 15000,
    updatedAt: new Date(),
  },
  {
    _id: new mongoose.Types.ObjectId(),
    type: SubscriptionTypes.TEAMS,
    key_limit: 10,
    is_active: true,
    usage_limit: 50000,
    usage_count: 0,
    updatedAt: new Date(),
  },
];

module.exports = mockSubscriptions;
