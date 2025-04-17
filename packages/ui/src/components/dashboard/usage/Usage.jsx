import PropTypes from "prop-types";
import PieGraph from "../PieGraph";
import styles from "./Usage.module.css";

function Usage({ usageCount, usageLimit }) {
  const percentage = (usageCount / usageLimit) * 100;

  return (
    <>
      <div className={styles.usageBodyContainer}>
        <div className={styles.circularChart}>
          <PieGraph
            percentage={percentage}
            colour="var(--primary)"
            fill="var(--border)"
          />
        </div>
        <div className={styles.usageStatistics}>
          <div className={styles.dataHeading}>Calls</div>
          <div className={styles.data}>{usageCount}</div>
          <div className={styles.dataHeading}>Limit</div>
          <div className={styles.data}>{usageLimit}</div>
        </div>
      </div>
      <div className={styles.dashboardResetDate}>
        Resets 1st of every month.
      </div>
    </>
  );
}

Usage.propTypes = {
  usageCount: PropTypes.number,
  usageLimit: PropTypes.number,
};

export default Usage;
