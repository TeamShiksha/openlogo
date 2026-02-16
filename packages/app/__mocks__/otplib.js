/* eslint-disable no-unused-vars */

// Jest mock for otplib (v13 compatible)

class OTP {
  constructor() {
    this.options = {};
  }

  generate(secret) {
    return "123456";
  }

  verify({ token, secret }) {
    return true; // must return boolean
  }
}

// Functional helpers (v13 style)

const generateSecret = jest.fn(() => "JBSWY3DPEHPK3PXP");

const generateURI = jest.fn(
  ({ type, accountName, issuer, secret }) =>
    `otpauth://${type}/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}`
);

// Functional API (sync — matches real behavior)
const generate = jest.fn(() => "123456");

const verify = jest.fn(() => true);

// Class-based TOTP mock
const TOTP = jest.fn().mockImplementation(() => ({
  options: {},
  generate: jest.fn(() => "123456"),
  verify: jest.fn(() => true),
}));

module.exports = {
  OTP,
  TOTP,
  generateSecret,
  generateURI,
  generate,
  verify,
};
