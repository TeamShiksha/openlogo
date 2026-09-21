import PropTypes from "prop-types";
import styles from "./VersionCard.module.css";
import AvatarStack from "./AvatarStack";

function VersionCard({ entry }) {
  if (!entry) return null;

  const { category, prNumber, title, description } = entry;

  // Normalize single contributor and array of contributors for rendering
  let rawContributors = [];
  if (entry.contributors) {
    rawContributors = entry.contributors;
  } else if (entry.contributor) {
    rawContributors = [entry.contributor];
  }

  // Filter out contributors with incomplete data and ensure profileUrl is linked to GitHub ID
  const contributors = rawContributors
    .filter((c) => c?.username)
    .map((c) => ({
      ...c,
      profileUrl: c.profileUrl || `https://github.com/${c.username}`,
      avatarUrl: c.avatarUrl || `https://unavatar.io/github/${c.username}`,
    }));

  // Determine category badge class dynamically
  const getCategoryClass = (catName) => {
    if (!catName) return styles["badge-default"];
    const formatted = catName.toLowerCase().replace(/\s+/g, "-");
    return styles[`badge-${formatted}`] || styles["badge-default"];
  };

  const hasBadges = Boolean(category || prNumber);
  const prUrl =
    entry.prUrl ||
    (prNumber
      ? `https://github.com/TeamShiksha/openlogo/pull/${prNumber}`
      : null);

  return (
    <div className={styles["entry-card"]}>
      {hasBadges && (
        <div className={styles["card-badges"]}>
          {category && (
            <span
              className={`${styles["badge-category"]} ${getCategoryClass(category)}`}
            >
              {category.toUpperCase()}
            </span>
          )}
          {prNumber && prUrl && (
            <a
              href={prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["badge-pr"]}
            >
              #{prNumber}
            </a>
          )}
          {prNumber && !prUrl && (
            <span className={styles["badge-pr"]}>#{prNumber}</span>
          )}
        </div>
      )}

      {title && <h3 className={styles["entry-title"]}>{title}</h3>}
      {description && (
        <p className={styles["entry-description"]}>{description}</p>
      )}

      {contributors.length > 0 && (
        <div className={styles["contributors-wrapper"]}>
          <AvatarStack users={contributors} size="small" />
        </div>
      )}
    </div>
  );
}

VersionCard.propTypes = {
  entry: PropTypes.shape({
    category: PropTypes.string,
    prNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    prUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    contributor: PropTypes.shape({
      username: PropTypes.string,
      avatarUrl: PropTypes.string,
      profileUrl: PropTypes.string,
    }),
    contributors: PropTypes.arrayOf(
      PropTypes.shape({
        username: PropTypes.string,
        avatarUrl: PropTypes.string,
        profileUrl: PropTypes.string,
      })
    ),
  }),
};

export default VersionCard;
