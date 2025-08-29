import propTypes from "prop-types";
import styles from "./AnalyticsCard.module.css";

function AnalyticsCard({ title, api }) {
  return (
    <div className={styles.card} data-testid="analytics-card">
      <div className={styles["card-title"]}>{title}</div>
      <div className={styles["card-content"]}>
        <div className={styles["left-content"]}>
          <div className={styles["card-value"]}>{api}</div>
        </div>
        <div className={styles["right-content"]}>
          <div
            className={`${styles["change-value"]} ${
              api >= 0
                ? styles["change-value-positive"]
                : styles["change-value-negative"]
            }`}
          >
            {api >= 0 ? `+${api}%` : `${api}%`}
          </div>
          <div className={styles["tracking-text"]}>vs last 7 days</div>
        </div>
      </div>
    </div>
  );
}

AnalyticsCard.propTypes = {
  title: propTypes.string.isRequired,
  api: propTypes.number.isRequired,
};

export default AnalyticsCard;
