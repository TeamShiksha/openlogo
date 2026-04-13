const sanitizeFilePath = (str) => {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

module.exports = { sanitizeFilePath };
