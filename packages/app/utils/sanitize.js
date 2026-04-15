const sanitizeFilePath = (str) => {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9._-]/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-+/, "")
    .replaceAll(/-+$/, "");
};

module.exports = { sanitizeFilePath };
