const trimTrailingHyphens = (s) => {
  let end = s.length;
  while (end > 0 && s.charCodeAt(end - 1) === 45) end -= 1;
  return end === s.length ? s : s.slice(0, end);
};

const sanitizeFilePath = (str) => {
  if (!str) return "";
  const normalized = str
    .trim()
    .toLowerCase()
    .replaceAll(/[^a-z0-9._-]/g, "-")
    .replaceAll(/-+/g, "-")
    .replaceAll(/^-+/, "");
  return trimTrailingHyphens(normalized);
};

module.exports = { sanitizeFilePath };
