export const SITE_DEFAULTS = {
  siteName: "Openlogo",
  defaultTitle: "Openlogo | Access hundreds of logos.",
  titleTemplate: "%s | Openlogo",
  description:
    "Openlogo gives you instant access to a vast library of brand logos through a simple API, plus tools to design and export your own.",
  ogImage: "/openlogo.png",
  siteUrl: "https://openlogo.fyi",
};

export function buildPageMeta(overrides = {}) {
  const { title, description, ogImage, path, noindex = false } = overrides;

  const resolvedTitle = title
    ? SITE_DEFAULTS.titleTemplate.replace("%s", title)
    : SITE_DEFAULTS.defaultTitle;

  const resolvedDescription = description ?? SITE_DEFAULTS.description;
  const resolvedOgImage = ogImage ?? SITE_DEFAULTS.ogImage;
  const absoluteOgImage = resolvedOgImage.startsWith("http")
    ? resolvedOgImage
    : `${SITE_DEFAULTS.siteUrl}${resolvedOgImage}`;
  const canonical = path
    ? `${SITE_DEFAULTS.siteUrl}${path}`
    : SITE_DEFAULTS.siteUrl;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    ogTitle: resolvedTitle,
    ogDescription: resolvedDescription,
    ogImage: absoluteOgImage,
    ogUrl: canonical,
    canonical,
    noindex,
  };
}
