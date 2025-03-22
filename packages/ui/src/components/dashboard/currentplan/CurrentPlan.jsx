import { guestTokenPresent } from "../../../utils/Helpers";
import styles from "./CurrentPlan.module.css";

function CurrentPlan() {
  const guestToken = guestTokenPresent();
  return (
    <>
      <p className={styles.currentPlan}>{guestToken ? "Guest" : "Hobby"}</p>
      <p className={styles.currentPlanTagline}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button className={styles.upgradeButton} disabled={!!guestToken}>
        Upgrade
      </button>
    </>
  );
}

export default CurrentPlan;
