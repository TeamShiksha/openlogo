module.exports = {
  preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["globalConfig"],
  moduleNameMapper: {
    // Mock otplib to avoid ES module issues
    "^otplib$": "<rootDir>/__mocks__/otplib.js",
  },
};
