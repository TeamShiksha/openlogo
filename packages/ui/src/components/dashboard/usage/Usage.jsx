import PieGraph from "../PieGraph";
import styles from "./Usage.module.css";

function Usage() {
  return (
    <div className={styles["dashboard-content-item"]}>
      <h6 className={styles["content-item-heading"]}>Usage</h6>
      <div className={styles["usage-body-container"]}>
        <div className={styles["circular-chart"]}>
          <PieGraph percentage={21} colour="#4F46E5" fill="#E6E6FA" />
        </div>
        <div className={styles["usage-statistics"]}>
          <div className={styles["data-heading"]}>Calls</div>
          <div className={styles.data}>105</div>
          <div className={styles["data-heading"]}>Limit</div>
          <div className={styles.data}>500</div>
        </div>
      </div>
      <div className={styles["dashboard-reset-date"]}>
        Resets 1st of every month.
      </div>
    </div>
  );
}

export default Usage;
