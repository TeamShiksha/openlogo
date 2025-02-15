const SIGNUP_PAYLOAD = {
  name: "TESTNAME",
  email: "testname@gmail.com",
  password: "testname@1234",
  confirmPassword: "testname@1234",
};

const ENDPOINTS = {
  SIGNUP: "/api/auth/signup",
  SIGNIN: "/api/auth/signin",
};

module.exports = {
  SIGNUP_PAYLOAD,
  ENDPOINTS,
};
