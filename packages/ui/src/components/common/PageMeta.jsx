import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { buildPageMeta } from "../../utils/metadata";

const PageMeta = ({ title, description, ogImage, path, noindex }) => {
  const meta = buildPageMeta({ title, description, ogImage, path, noindex });

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.noindex && <meta name="robots" content="noindex" />}
      <meta property="og:site_name" content="Openlogo" />
      <meta property="og:title" content={meta.ogTitle} />
      <meta property="og:description" content={meta.ogDescription} />
      <meta property="og:image" content={meta.ogImage} />
      <meta property="og:url" content={meta.ogUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.ogTitle} />
      <meta name="twitter:description" content={meta.ogDescription} />
      <meta name="twitter:image" content={meta.ogImage} />
      <link rel="canonical" href={meta.canonical} />
    </Helmet>
  );
};

PageMeta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  ogImage: PropTypes.string,
  path: PropTypes.string,
  noindex: PropTypes.bool,
};

export default PageMeta;
