const URL_REGEX =
  /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/;

module.exports = {
  URL_REGEX,
  URL_ERROR_MESSAGE: "Please enter a valid URL.",
};
