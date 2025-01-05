import PieGraph from "../PieGraph";
import styles from "./Usage.module.css";

function Usage() {
  return (
    <div className={styles.dashboardContentItem}>
      <h6 className={styles.contentItemHeading}>Usage</h6>
      <div className={styles.usageBodyContainer}>
        <div className={styles.circularChart}>
          <PieGraph percentage={21} colour="#4F46E5" fill="#E6E6FA" />
        </div>
        <div className={styles.usageStatistics}>
          <div className={styles.dataHeading}>Calls</div>
          <div className={styles.data}>105</div>
          <div className={styles.dataheading}>Limit</div>
          <div className={styles.data}>500</div>
        </div>
      </div>
      <div className={styles.dashboardResetDate}>
        Resets 1st of every month.
      </div>
    </div>
  );
}

export default Usage;
