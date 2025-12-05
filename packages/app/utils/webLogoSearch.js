/**
 * Utility function for discovering logo images from common CDN and domain-based sources.
 * Given a company or product name, it attempts multiple heuristic URLs, fetches image bytes,
 * identifies valid PNG/SVG logos, and returns structured metadata for each match.
 * A single Clearbit lookup is used to attach the canonical company domain when available.
 */
const axios = require("axios");
const { imageSize } = require("image-size");
async function grabPngLogos(query, limit = 5) {
  const result = { success: false, count: 0, logos: [] };
  if (!query || typeof query !== "string") {
    throw new TypeError("grabPngLogos: `query` must be a non-empty string");
  }
  const raw = query.trim().toLowerCase();
  const nameNoSpace = raw.split(" ").join("");
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
    `https://api.brandfetch.io/v2/logo/${nameNoSpace}.png`,
    `https://www.google.com/s2/favicons?domain=${nameNoSpace}.com&sz=256`,
    `https://api.faviconkit.com/${nameNoSpace}.com/512`,
    `https://api.faviconkit.com/${nameNoSpace}.io/512`,
    `https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/${nameNoSpace}.png`,
  ];
  async function prepareLogoData(url) {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 5000,
      maxContentLength: 5 * 1024 * 1024,
    });
    const buffer = Buffer.from(res.data);
    const info = imageSize(buffer);
    const type = info.type;
    return {
      url,
      companyUri: null,
      type,
      imageSize: buffer.length,
    };
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

  if (logos.length > 0) {
    try {
      const searchTerm = encodeURIComponent(nameNoSpace);
      const clearbitResponse = await axios.get(
        `https://autocomplete.clearbit.com/v1/companies/suggest?query=${searchTerm}`,
        { timeout: 3000 }
      );
      const suggestions = Array.isArray(clearbitResponse.data)
        ? clearbitResponse.data
        : [];
      const suggestedDomain =
        suggestions.length > 0 && suggestions[0].domain
          ? suggestions[0].domain
          : null;
      if (suggestedDomain) {
        const canonicalCompanyUrl = `https://${suggestedDomain.replace(/\/+$/, "")}/`;
        logos = logos.map((logo) => ({
          ...logo,
          companyUri: canonicalCompanyUrl,
        }));
      }
    } catch (error) {
      console.log(" Company URI Failed:", error.message);
    }
  }

  result.success = logos.length > 0;
  result.count = logos.length;
  result.logos = logos;
  return result;
}

module.exports = { grabPngLogos };
