import { useState } from "react";
import { RELEASE_PAGE } from "../../utils/Constants";
import styles from "./Release.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import VersionCard from "./VersionCard";

function ChangeLog() {
  const { changelog, versions, latestVersion } = RELEASE_PAGE;
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedVersionData = changelog.versionsData.filter(
    ({ versionName }) => versionName === selectedVersion
  );

  return (
    <section className={styles["changelog-container"]}>
      <div className={styles["changelog-header"]}>
        <div>
          <h2>Changelog</h2>
          <p>Changelog with often recorded&apos;s versions</p>
        </div>
        <div className={styles["dropdown"]}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <span>
              {selectedVersion ? `${selectedVersion}` : "All Versions"}
            </span>
            {isDropdownOpen ? (
              <ChevronUp className={styles["icon"]} />
            ) : (
              <ChevronDown className={styles["icon"]} />
            )}
          </button>

          {isDropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              {versions.map((versionName) => (
                <button
                  key={versionName}
                  onClick={() => {
                    setSelectedVersion(versionName);
                    setIsDropdownOpen(false);
                  }}
                >
                  {versionName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles["versions-section"]}>
        {selectedVersionData.map((versionData) => (
          <VersionCard key={versionData.versionName} {...versionData} />
        ))}
      </div>
    </section>
  );
}

export default ChangeLog;
