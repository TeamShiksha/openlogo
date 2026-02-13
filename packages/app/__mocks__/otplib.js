/* eslint-disable no-unused-vars */
// Mock for otplib to avoid ES module issues in Jest
class OTP {
  constructor() {
    this.options = {};
  }

  generate(secret) {
    return "123456";
  }

  verify({ token, secret }) {
    return true;
  }
}

const authenticator = {
  generate: jest.fn(() => "123456"),
  verify: jest.fn(() => true),
  generateSecret: jest.fn(() => "JBSWY3DPEHPK3PXP"),
  keyuri: jest.fn(
    (user, service, secret) =>
      `otpauth://totp/${service}:${user}?secret=${secret}&issuer=${service}`
  ),
  options: {},
};

module.exports = {
  OTP,
  authenticator,
};
