const axios = require("axios");

async function grabPngLogos(
  query,
  { limit = 5, includeVariants = false, formats = ["png"] } = {}
) {
  const result = { success: false, count: 0, logos: [] };
  if (!query || typeof query !== "string") return result;

  const name = encodeURIComponent(query.trim().toLowerCase());
  const allowed = new Set((formats || []).map((f) => String(f).toLowerCase()));

  const candidates = [
    `https://img.icons8.com/color/512/${name}.png`,
    `https://img.icons8.com/fluency/512/${name}.png`,
    `https://img.icons8.com/ios-filled/512/${name}.png`,
    `https://img.icons8.com/ios/512/${name}.png`,
    `https://img.icons8.com/color/256/${name}.png`,
    `https://img.icons8.com/office/512/${name}.png`,
    `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${name}.png`,
    `https://cdn.jsdelivr.net/npm/@iconify/icons-logos/${name}.png`,
    `https://cdn.jsdelivr.net/npm/@iconify/icons-simple-icons/${name}.png`,
    `https://logo.clearbit.com/${name}.com`,
    `https://github.com/${name}.png`,
    `https://avatars.githubusercontent.com/${name}?size=512`,
    `https://api.brandfetch.io/v2/logo/${name}.png`,
  ];

  if (includeVariants) {
    candidates.push(`https://static.cdnlogo.com/logos/${name[0]}/${name}.png`);
  }

  const detectFormat = (contentType, url) => {
    if (/image\/png/i.test(contentType) || /\.png(\?|$)/i.test(url))
      return "png";
    if (
      /image\/(x-icon|ico|vnd\.microsoft\.icon)/i.test(contentType) ||
      /\.ico(\?|$)/i.test(url)
    )
      return "ico";
    return null;
  };

  async function checkUrl(url) {
    try {
      const head = await axios.head(url, {
        timeout: 3000,
        validateStatus: null,
      });
      if (head && (head.status === 200 || head.status === 206)) {
        const fmt = detectFormat(head.headers["content-type"] || "", url);
        if (fmt && allowed.has(fmt)) return fmt;
        return null;
      }
      if (head && head.status !== 405) return null; // skip 404/403/etc
    } catch {
      // HEAD failed — fallback to GET
    }

    try {
      const res = await axios.get(url, {
        timeout: 5000,
        responseType: "arraybuffer",
        validateStatus: null,
      });
      if (!(res && (res.status === 200 || res.status === 206))) return null;
      const fmt = detectFormat(res.headers["content-type"] || "", url);
      if (
        fmt &&
        allowed.has(fmt) &&
        Buffer.isBuffer(res.data) &&
        res.data.length > 64
      )
        return fmt;
    } catch {
      // missing / invalid
    }
    return null;
  }

  const logos = [];
  for (const url of [...new Set(candidates)]) {
    if (logos.length >= limit) break;
    const fmt = await checkUrl(url);
    if (fmt) logos.push({ url, source: new URL(url).hostname, format: fmt });
  }

  result.success = logos.length > 0;
  result.count = logos.length;
  result.logos = logos;
  return result;
}

module.exports = { grabPngLogos };
