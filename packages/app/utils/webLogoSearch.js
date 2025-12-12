/**
 * Utility function for discovering company logo images.
 * 1. Find the company's official domain using Clearbit.
 * 2. Extract image URLs from header/nav sections
 * 3. Detect discovered images its format & size,
 */
const puppeteer = require("puppeteer");
const https = require("https");
const axios = require("axios");
const { imageSize } = require("image-size");
const { URL } = require("url");

async function grabCompanyLogos(companyName, limit = 5) {
  if (!companyName || typeof companyName !== "string")
    return { success: false, count: 0, logos: [] };

  try {
    const domain = await getCompanyDomain(companyName);
    if (!domain) return { success: false, count: 0, logos: [] };

    const discoveredUrls = await scrapeHeaderImageUrls(domain);
    if (!Array.isArray(discoveredUrls) || discoveredUrls.length === 0)
      return { success: false, count: 0, logos: [] };

    const logos = [];
    for (const raw of discoveredUrls.slice(0, limit)) {
      const absoluteUrl = resolveUrl(domain, raw);
      if (!absoluteUrl) continue;
      const imageMeta = await fetchImageMeta(absoluteUrl);
      if (!imageMeta) continue;

      logos.push({
        companyName,
        url: imageMeta.url,
        companyUri: domain,
        extension: imageMeta.originalExtension || "unknown",
        size: imageMeta.originalSize || null,
      });
    }

    return { success: logos.length > 0, count: logos.length, logos };
  } catch (err) {
    console.warn("grabCompanyLogos error:", err && err.message);
    return { success: false, count: 0, logos: [] };
  }
}

function getCompanyDomain(name) {
  if (!name) return null;
  const q = encodeURIComponent(name.trim());
  const url = `https://autocomplete.clearbit.com/v1/companies/suggest?query=${q}`;
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const arr = JSON.parse(data);
            resolve(arr[0]?.domain ? `https://${arr[0].domain}/` : null);
          } catch {
            resolve(null);
          }
        });
      })
      .on("error", () => resolve(null));
  });
}

function resolveUrl(baseDomain, src) {
  try {
    return new URL(src, baseDomain).toString();
  } catch {
    return null;
  }
}

async function scrapeHeaderImageUrls(pageOrigin) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(45000);
    try {
      await page.goto(pageOrigin, { waitUntil: "domcontentloaded" });
    } catch {
      await page.goto(pageOrigin, { waitUntil: "load" });
    }

    const urls = await page.evaluate(() => {
      const set = new Set();
      document
        .querySelectorAll("header img, nav img")
        .forEach((i) => i.src && set.add(i.src));
      document
        .querySelectorAll("header, nav, header *, nav *")
        .forEach((el) => {
          try {
            const bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg.includes("url(")) {
              const m = bg.match(/url\(["']?(.*?)["']?\)/);
              if (m && m[1]) set.add(m[1]);
            }
          } catch {
            // Ignore CSS parsing errors
          }
        });
      return [...set];
    });

    return urls;
  } finally {
    if (browser)
      try {
        await browser.close();
      } catch {
        // Ignore browser cleanup errors
      }
  }
}

async function fetchImageMeta(url) {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 7000,
      maxContentLength: 6 * 1024 * 1024,
    });
    const buf = Buffer.from(res.data);
    let info = null;
    try {
      info = imageSize(buf);
    } catch {
      // Unable to determine image dimensions
    }
    const ext =
      info?.type ||
      (() => {
        try {
          return new URL(url).pathname.split(".").pop().toLowerCase();
        } catch {
          return "unknown";
        }
      })();
    return { url, originalExtension: ext, originalSize: buf.length };
  } catch {
    return null;
  }
}
module.exports = { grabCompanyLogos };
