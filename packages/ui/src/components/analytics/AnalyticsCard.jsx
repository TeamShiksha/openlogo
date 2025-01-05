import { useState, useEffect } from "react";
import propTypes from "prop-types";
// import increasingImage from "../../src/assets/growth.svg";
// import decreasingImage from "../../src/assets/decline.svg";
import styles from "./AnalyticsCard.module.css";
export default function AnalyticsCard({ title, api }) {
  const [value, setValue] = useState(1000);
  const [change, setChange] = useState(255);

  async function fetchAndUpdateValue() {
    // get value from API
    setValue(1454); // Example value
  }

  async function fetchAndUpdatePercentageChange(api) {
    // get value from API
    setChange(api); // Use the api value directly for change
  }

  useEffect(() => {
    fetchAndUpdateValue(api);
    fetchAndUpdatePercentageChange(api);
  }, [api]);

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <div className={styles.leftContent}>
          <div className={styles.cardTitle}>{title}</div>
          <div className={styles.cardValue}>{value}</div>
        </div>
        <div className={styles.rightContent}>
          {/* {change >= 0 ? (
            <img
              // src={increasingImage}
              alt="Increasing"
              className={styles.changeGraph}
            />
          ) : (
            <img
              // src={decreasingImage}
              alt="Decreasing"
              className={styles.changeGraph}
            />
          )} */}
          <div
            className={`${styles.changeValue} ${
              change >= 0
                ? styles.changeValuePositive
                : styles.changeValueNegative
            }`}
          >
            {change >= 0 ? `+${change}%` : `${change}%`}
          </div>
          <div className={styles.trackingText}>vs last 7 days</div>
        </div>
      </div>
    </div>
  );
}

AnalyticsCard.propTypes = {
  title: propTypes.string.isRequired,
  api: propTypes.number.isRequired,
};
