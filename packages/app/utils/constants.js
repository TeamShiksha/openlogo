/**
 * @readonly
 * @enum {string}
 **/

const EmailValidationRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

const GuestToken = "x-guest-token";

const UserTokenTypes = {
  FORGOT: "FORGOT",
  VERIFY: "VERIFY",
};

const UserType = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
  OPERATOR: "OPERATOR",
  GUEST: "GUEST",
};

const SubscriptionTypes = {
  HOBBY: "HOBBY",
  PRO: "PRO",
  TEAMS: "TEAMS",
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

const Messages = {
  GUEST_USER_EXISTS: "Guest session already active",
  EMAIL_EXISTS: "Email already exists.",
  EMAIL_DOESNT_EXISTS: "Email doesn't exists.",
  USER_NOT_FOUND: "User not found.",
  DATA_NOT_FOUND: "User data not found.",
  SOMETHING_WENT_WRONG:
    "We're experiencing high demand. Please try again later.",
  INCORRECT_EMAIL_PASS: "Incorrect email or password.",
  EMAIL_NOT_VERIFIED: "Email not verified",
  SESSION_FAIL: "User session validation failed.",
  INVALID_TOKEN: "Invalid token.",
  EXPIRED_TOKEN: "Token expired.",
  VERIFICATION_FAIL: "Verification failed.",
  PASS_FAILED: "Failed to update password.",
  IMAGE_REQUIRED: "Image not found in request.",
  NAME_AND_EXT_SAME: "Name and extension should be same.",
  UPLOAD_FAILED: "Image upload failed.",
  UPDATE_IMAGE_FAILED: "Failed to update image record.",
  UPLOAD_SUCCESS: "Image updated successfully.",
  INVALID_KEY: "Invalid API key.",
  LIMIT_REACHED: "Limit reached. Consider upgrading your plan.",
  LOGO_NOT_FOUND: "Logo not found.",
  FETCH_ALL_MESSAGE: "Fetched all contact us messages.",
  MESSAGE_NOT_FOUND: "Message not found.",
  ALREADY_SEND_RESPOND: "Already sent the response.",
  UPDATE_SUCCESS: "Responded successfully.",
  INCORRECT_PASSWORD: "Current password is incorrect",
  INTERNAL_SERVER_ERROR:
    "An unexpected error occurred. Please try again later.",
};

module.exports = {
  EmailValidationRegex,
  GuestToken,
  UserTokenTypes,
  UserType,
  SubscriptionTypes,
  StatusTypes,
  DefaultSubscriptionPlan,
  Messages,
};
