const axios = require("axios");
const { imageSize } = require("image-size");
async function grabPngLogos(query, limit = 5) {
  const result = { success: false, count: 0, logos: [] };
  if (!query || typeof query !== "string") return result;
  const raw = query.trim().toLowerCase();
  const nameNoSpace = raw.replace(/\s+/g, "");
  const pngCandidates = [
    `https://img.icons8.com/color/512/${nameNoSpace}.png`,
    `https://img.icons8.com/ios-filled/512/${nameNoSpace}.png`,
    `https://img.icons8.com/fluency/512/${nameNoSpace}.png`,
    `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${nameNoSpace}.png`,
    `https://cdn.jsdelivr.net/npm/@iconify/icons-logos/${nameNoSpace}.png`,
    `https://cdn.jsdelivr.net/npm/@iconify/icons-simple-icons/${nameNoSpace}.png`,
    `https://unpkg.com/simple-icons@latest/icons/${nameNoSpace}.png`,
    `https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/${nameNoSpace}.png`,
    `https://raw.githubusercontent.com/github/explore/main/topics/${nameNoSpace}/${nameNoSpace}.png`,
    `https://api.iconify.design/${nameNoSpace}.png`,
    `https://api.iconify.design/simple-icons:${nameNoSpace}.png`,
  ];
  const domainCandidates = [
    `https://logo.clearbit.com/${nameNoSpace}.com`,
    `https://logo.clearbit.com/${nameNoSpace}.io`,
    `https://logo.clearbit.com/${nameNoSpace}.org`,
    `https://logo.clearbit.com/${nameNoSpace}.co`,
    `https://github.com/${nameNoSpace}.png`,
    `https://avatars.githubusercontent.com/${nameNoSpace}?size=512`,
    `https://api.brandfetch.io/v2/logo/${nameNoSpace}.png`,
    `https://www.google.com/s2/favicons?domain=${nameNoSpace}.com&sz=256`,
    `https://api.faviconkit.com/${nameNoSpace}.com/512`,
    `https://api.faviconkit.com/${nameNoSpace}.io/512`,
    `https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${nameNoSpace}.png`,
  ];
  async function prepareLogoData(url) {
    try {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      const buffer = Buffer.from(res.data);

      const info = imageSize(buffer);
      const type = info.type;

      const query = encodeURIComponent(nameNoSpace);
      const searchCompanyUrl = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`;
      const companyUri = await axios.get(searchCompanyUrl);
      const results = companyUri.data;
      return {
        url,
        companyUri: results[0].domain ? `https://${results[0].domain}/` : null,
        type,
        imageSize: buffer.length,
      };
    } catch (err) {
      console.log(err.message);
      return null;
    }
  }
  async function collectFromList(list, logosSoFar) {
    const CONCURRENCY = 6;
    const out = logosSoFar.slice();
    let i = 0;
    while (i < list.length && out.length < limit) {
      const batch = list.slice(i, i + CONCURRENCY);
      const results = await Promise.all(batch.map((u) => prepareLogoData(u)));
      for (const r of results) {
        if (r && !out.find((l) => l.url === r.url)) {
          out.push(r);
          if (out.length >= limit) break;
        }
      }
      i += CONCURRENCY;
    }
    return out;
  }
  let logos = await collectFromList(pngCandidates, []);
  if (logos.length < limit) {
    logos = await collectFromList(domainCandidates, logos);
  }
  result.success = logos.length > 0;
  result.count = logos.length;
  result.logos = logos;
  return result;
}

module.exports = { grabPngLogos };
