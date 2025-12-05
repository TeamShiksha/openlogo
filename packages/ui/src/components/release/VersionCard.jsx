import styles from "./Release.module.css";

function VersionCard(versionData) {
  const { versionName, date, imgSrc, releaseNotes } = versionData;
  return (
    <div className={styles["version-card-container"]}>
      {/* Desktop layout - Date positioned to the left */}
      <div className={styles["date-left"]}>{date}</div>

      {/* Desktop Timeline dot */}
      <div className={styles["timeline-dot"]}>
        <div className={styles["mobile-dot"]}></div>
      </div>

      {/* Timeline connector line */}
      <div className={styles["timeline-connector"]}></div>

      {/* Content area */}
      <div className={styles["content-area"]}>
        {/* Mobile: Date and Version stacked */}
        <div className={styles["mobile-header"]}>
          <div className={styles["mobile-dot"]}></div>
          <div className={styles["mobile-meta"]}>
            <h3 style={{ color: "#1A1A1A", margin: 0 }}>
              Version {versionName}
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#6F6F6F" }}>
              {date}
            </p>
          </div>
        </div>

        {/* Desktop: Version header only */}
        <div className={styles["desktop-header"]}>
          <h3 style={{ color: "#1A1A1A", margin: 0 }}>Version {versionName}</h3>
        </div>

        {/* Screenshot with solid background */}
        <div className={styles["screenshot-wrap"]}>
          <div className={styles["screenshot-inner"]}>
            <img src={imgSrc} alt={`Version ${versionName} screenshot`} />
          </div>
        </div>

        {/* Release Notes */}
        {releaseNotes && releaseNotes.length > 0 && (
          <div className={styles["release-notes"]}>
            <h3
              style={{
                marginBottom: "0.75rem",
                color: "#1A1A1A",
                fontWeight: 600,
              }}
            >
              Release Notes
            </h3>
            <ul className={styles["notes-list"]}>
              {releaseNotes?.map((r, index) => (
                <li key={index} className={styles["note-item"]}>
                  <span className={styles["note-dot"]}></span>
                  <span className={styles["note-text"]}>{r.releaesNote}</span>
                  <span className={styles["note-link"]}>
                    {r.link ? (
                      <a
                        href={r.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {r.githubUserName
                          ? `(${r.githubUserName})`
                          : r.githubUserName}
                      </a>
                    ) : r.githubUserName ? (
                      `(${r.githubUserName})`
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default VersionCard;
