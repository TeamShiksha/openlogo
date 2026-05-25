const dummyPassword = require("./generatePassword").generatePassword();

const SIGNUP_PAYLOAD = {
  name: "TESTNAME",
  email: "testname@gmail.com",
  password: dummyPassword,
  confirmPassword: dummyPassword,
};

const ENDPOINTS = {
  SIGNUP: "/api/auth/signup",
  SIGNIN: "/api/auth/signin",
  SIGNOUT: "/api/auth/signout",
  VERIFY: "/api/auth/verify",
  FORGOT_PASSWORD: "/api/auth/password/forgot",
  RESET_PASSWORD_SESSION: "/api/auth/password/forgot",
  RESET_PASSWORD: "/api/auth/password/reset",
  MESSAGES: "/api/messages",
  REQUESTS: "/api/requests",
};

module.exports = {
  SIGNUP_PAYLOAD,
  ENDPOINTS,
};
