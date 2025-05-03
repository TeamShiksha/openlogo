import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  return (
    <>
      <p className={styles["current-plan"]}>Hobby</p>
      <p className={styles["current-plan-tagline"]}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles["upgrade-button"]}>Upgrade</button>
    </>
  );
}

export default CurrentPlan;
