const signupRequest = {
  name: "TESTNAME",
  email: "testname@gmail.com",
  password: "testname@1234",
  confirmPassword: "testname@1234",
};

const Endpoints = {
  SIGNUP: "/api/auth/signup",
  SIGNIN: "/api/auth/signin",
};

module.exports = {
  signupRequest,
  Endpoints,
};
