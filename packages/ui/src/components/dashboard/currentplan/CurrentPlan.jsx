import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  return (
    <>
      <p className={styles.currentPlan}>Hobby</p>
      <p className={styles.currentPlanTagline}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles.upgradeButton}>Upgrade</button>
    </>
  );
}

export default CurrentPlan;
