import styles from "./Release.module.css";

function VersionCard(versionData) {
  const { versionName, releaseDate, imgSrc, releaseNotes } = versionData;
  return (
    <div className={styles["version-card-container"]}>
      <div className={styles["date-left"]}>{releaseDate}</div>

      <div className={styles["timeline-dot"]}>
        <div className={styles["mobile-dot"]}></div>
      </div>

      <div className={styles["timeline-connector"]}></div>

      <div className={styles["content-area"]}>
        <div className={styles["mobile-header"]}>
          <div className={styles["mobile-dot"]}></div>
          <div className={styles["mobile-meta"]}>
            <h3>{versionName}</h3>
            <p className={styles["release-date"]}>{releaseDate}</p>
          </div>
        </div>

        <div className={styles["desktop-header"]}>
          <h3>{versionName}</h3>
        </div>

        <div className={styles["screenshot-wrap"]}>
          <div className={styles["screenshot-inner"]}>
            <img src={imgSrc} alt={`Version ${versionName} screenshot`} />
          </div>
        </div>

        {releaseNotes && releaseNotes.length > 0 && (
          <div className={styles["release-notes"]}>
            <h3>Release Notes</h3>
            <ul className={styles["notes-list"]}>
              {releaseNotes?.map(
                (
                  {
                    releaseNote,
                    contributorGithubUserName,
                    contributorGithublink,
                  },
                  index
                ) => (
                  <li key={releaseNote + index} className={styles["note-item"]}>
                    <span className={styles["dot"]}></span>
                    <span className={styles["list-description"]}>
                      {releaseNote}{" "}
                      <span className={styles["note-link"]}>
                        (By{" "}
                        {contributorGithublink && (
                          <a
                            href={contributorGithublink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {contributorGithubUserName}
                          </a>
                        )}
                        )
                      </span>
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default VersionCard;
