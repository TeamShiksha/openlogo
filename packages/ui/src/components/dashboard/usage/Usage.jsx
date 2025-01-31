import PieGraph from "../PieGraph";
import styles from "./Usage.module.css";

function Usage() {
  return (
    <>
      <div className={styles.usageBodyContainer}>
        <div className={styles.circularChart}>
          <PieGraph
            percentage={21}
            colour="var(--primary)"
            fill="var(--border)"
          />
        </div>
        <div className={styles.usageStatistics}>
          <div className={styles.dataHeading}>Calls</div>
          <div className={styles.data}>105</div>
          <div className={styles.dataHeading}>Limit</div>
          <div className={styles.data}>500</div>
        </div>
      </div>
      <div className={styles.dashboardResetDate}>
        Resets 1st of every month.
      </div>
    </>
  );
}

export default Usage;
