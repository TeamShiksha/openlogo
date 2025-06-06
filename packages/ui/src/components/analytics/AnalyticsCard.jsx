import { useState, useEffect } from "react";
import propTypes from "prop-types";
import styles from "./AnalyticsCard.module.css";

function AnalyticsCard({ title, api }) {
  const [value, setValue] = useState(1000);
  const [change, setChange] = useState(255);

  async function fetchAndUpdateValue() {
    setValue(api);
  }

  async function fetchAndUpdatePercentageChange(api) {
    setChange(api);
  }

  useEffect(() => {
    fetchAndUpdateValue();
    fetchAndUpdatePercentageChange(api);
  }, [api]);

  return (
    <div className={styles.card} data-testid="analytics-card">
      <div className={styles["card-title"]}>{title}</div>
      <div className={styles["card-content"]}>
        <div className={styles["left-content"]}>
          <div className={styles["card-value"]}>{value}</div>
        </div>
        <div className={styles["right-content"]}>
          <div
            className={`${styles["change-value"]} ${
              change >= 0
                ? styles["change-value-positive"]
                : styles["change-value-negative"]
            }`}
          >
            {change >= 0 ? `+${change}%` : `${change}%`}
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
