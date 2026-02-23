module.exports = {
  preset: "@shelf/jest-mongodb",
  watchPathIgnorePatterns: ["globalConfig"],
  testPathIgnorePatterns: ["/node_modules/", "/shared/"],
};
