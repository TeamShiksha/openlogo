import { useState } from "react";
import { RELEASE_PAGE } from "../../utils/Constants";
import styles from "./Release.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import VersionCard from "./VersionCard";

function ChangeLog() {
  const { changelog, versions } = RELEASE_PAGE;
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedVersionData = selectedVersion
    ? changelog.versionsData.filter((v) => v.versionName === selectedVersion)
    : changelog.versionsData;

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
              {selectedVersion ? `Version ${selectedVersion}` : "All Versions"}
            </span>
            {isDropdownOpen ? (
              <ChevronUp className={styles["icon"]} />
            ) : (
              <ChevronDown className={styles["icon"]} />
            )}
          </button>

          {isDropdownOpen && (
            <div className={styles["dropdown-menu"]}>
              <button
                onClick={() => {
                  setSelectedVersion(null);
                  setIsDropdownOpen(false);
                }}
              >
                All Versions
              </button>
              {versions.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setSelectedVersion(v);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F5F5F7] transition-colors"
                >
                  Version {v}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Vertical timeline line - Desktop only */}
      <div className="hidden md:block absolute left-[107px] top-[180px] bottom-0 w-[1px] bg-gray-200 dotted-line"></div>

      <div className={styles["versions-section"]}>
        {selectedVersionData.map((versionData) => (
          <VersionCard key={versionData.version} {...versionData} />
        ))}
      </div>
    </section>
  );
}

export default ChangeLog;
