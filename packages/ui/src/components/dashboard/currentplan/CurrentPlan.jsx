import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  return (
    <>
      <h4 className={styles.currentPlan}>Hobby</h4>
      <p className={styles.currentPlanTagline}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles.upgradeButton}>Upgrade</button>
    </>
  );
}

export default CurrentPlan;
