import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  return (
    <div className={styles.dashboardContentItem}>
      <div className={styles.currentPlanHeader}>
        <h3 className={styles.contentItemHeading}>Plan</h3>
        <div className={styles.active}>Active</div>
      </div>
      <h4 className={styles.currentPlan}>Hobby</h4>
      <p className={styles.currentPlanTagline}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles.upgradeButton}>Upgrade</button>
    </div>
  );
}

export default CurrentPlan;
