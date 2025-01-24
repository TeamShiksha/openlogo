import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  return (
    <div className={styles["dashboard-content-item"]}>
      <div className={styles["current-plan-header"]}>
        <h3 className={styles["content-item-heading"]}>Plan</h3>
        <div className={styles.active}>Active</div>
      </div>
      <h4 className={styles["current-plan"]}>Hobby</h4>
      <p className={styles["current-plan-tagline"]}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles["upgrade-button"]}>Upgrade</button>
    </div>
  );
}

export default CurrentPlan;
