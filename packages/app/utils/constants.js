/**
 * @readonly
 * @enum {string}
 **/
const UserTokenTypes = {
  FORGOT: "FORGOT",
  VERIFY: "VERIFY",
};

const UserType = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  OPERATOR: "OPERATOR",
};

const SubscriptionTypes = {
  HOBBY: "HOBBY",
  PRO: "PRO",
  TEAMS: "TEAMS",
};

const ContactUsStatus = {
  PENDING: "PENDING",
  RESOLVED: "RESOLVED",
};

const StatusTypes = {
  PENDING: "PENDING",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
};

const DefaultSubscriptionPlan = {
  type: SubscriptionTypes.HOBBY,
  key_limit: 2,
  usage_limit: 500,
  usage_count: 0,
  is_active: true,
};

module.exports = {
  UserTokenTypes,
  UserType,
  SubscriptionTypes,
  ContactUsStatus,
  StatusTypes,
  DefaultSubscriptionPlan,
};
