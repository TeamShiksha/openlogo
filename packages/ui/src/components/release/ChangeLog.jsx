import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./ChangeLog.module.css";
import { ChevronDown, ChevronUp } from "lucide-react";
import VersionCard from "./VersionCard";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  return dateStr;
}

function ChangeLog({
  versions = [],
  selectedVersion,
  setSelectedVersion,
  selectedRelease,
  loading = false,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const menuRef = useRef(null);
  const activeItemRef = useRef(null);

  // Auto-scroll dropdown so the selected version is at the top when opened
  useEffect(() => {
    if (isDropdownOpen && activeItemRef.current && menuRef.current) {
      menuRef.current.scrollTop = activeItemRef.current.offsetTop;
    }
  }, [isDropdownOpen]);

  const selectedVersionItem = versions.find(
    (v) => v.version === selectedVersion
  );

  // Reset active filter when changing release versions
  useEffect(() => {
    setActiveCategory("All");
  }, [selectedVersion]);

  const ALLOWED_CATEGORIES = [
    "Feature",
    "Enhancement",
    "Bug Fix",
    "Security",
    "Other",
  ];

  // Extract unique allowed categories for filter pills from the selected release's entries
  const entries = selectedRelease?.entries || [];
  const availableCategories = selectedRelease
    ? [
        "All",
        ...ALLOWED_CATEGORIES.filter((cat) =>
          entries.some((e) => e.category === cat)
        ),
      ]
    : ["All"];

  // Filter entries based on the active category pill
  const filteredEntries = selectedRelease
    ? entries.filter(
        (entry) => activeCategory === "All" || entry.category === activeCategory
      )
    : [];

  const rawDate =
    selectedVersionItem?.releaseDate || selectedRelease?.releaseDate;
  const formattedDate = formatDate(rawDate);

  return (
    <section
      id="changelog"
      className={`${styles["changelog-section"]} container`}
    >
      <div className={styles["changelog-header"]}>
        <h2 className={styles["changelog-title"]}>Changelog</h2>
        <div className={styles["dropdown-wrapper"]}>
          <button
            className={styles["dropdown-trigger"]}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{formattedDate || selectedVersion || "Select Release"}</span>
            {isDropdownOpen ? (
              <ChevronUp className={styles["dropdown-icon"]} />
            ) : (
              <ChevronDown className={styles["dropdown-icon"]} />
            )}
          </button>

          {isDropdownOpen && (
            <div ref={menuRef} className={styles["dropdown-menu"]}>
              {versions.map((release) => {
                const isSelected = release.version === selectedVersion;
                const dateText = formatDate(release.releaseDate);
                const label = dateText
                  ? `${dateText} (v${release.version})`
                  : release.version;
                return (
                  <button
                    key={release.version}
                    ref={isSelected ? activeItemRef : null}
                    type="button"
                    className={`${styles["dropdown-item"]} ${
                      isSelected ? styles["active"] : ""
                    }`}
                    onClick={() => {
                      setSelectedVersion(release.version);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={styles["changelog-layout"]}>
        {/* Timeline Column */}
        <div className={styles["timeline-column"]}>
          <span className={styles["timeline-date"]}>
            {formattedDate?.toUpperCase()}
          </span>
          <div className={styles["timeline-dot-wrapper"]}>
            <div className={styles["timeline-dot-halo"]}>
              <div className={styles["timeline-dot-inner"]}></div>
            </div>
            <div className={styles["timeline-connector-line"]}></div>
          </div>
        </div>

        {/* Content Column */}
        <div className={styles["content-column"]}>
          {/* Category Filter Pills */}
          <div className={styles["filters-container"]}>
            {availableCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`${styles["filter-pill"]} ${
                  activeCategory === category
                    ? styles["filter-pill-active"]
                    : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cards List Container */}
          <div className={styles["cards-list-box"]}>
            {loading ? (
              <div className={styles["no-entries"]}>
                <LoadingSpinner size={32} border={3} color="var(--primary)" />
              </div>
            ) : filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <VersionCard
                  key={`${entry.prNumber || entry.title || "entry"}-${index}`}
                  entry={entry}
                />
              ))
            ) : (
              <div className={styles["no-entries"]}>
                No updates in this category for this release.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

ChangeLog.propTypes = {
  versions: PropTypes.arrayOf(
    PropTypes.shape({
      version: PropTypes.string,
      releaseDate: PropTypes.string,
    })
  ),
  selectedVersion: PropTypes.string.isRequired,
  setSelectedVersion: PropTypes.func.isRequired,
  selectedRelease: PropTypes.shape({
    version: PropTypes.string,
    releaseDate: PropTypes.string,
    heroImage: PropTypes.string,
    entries: PropTypes.array,
  }),
  loading: PropTypes.bool,
};

export default ChangeLog;
