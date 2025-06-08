import styles from "./CurrentPlan.module.css";
import PropTypes from "prop-types";

function CurrentPlan({ isGuest }) {
  return (
    <>
      <p className={styles["current-plan"]}>Hobby</p>
      <p className={styles["current-plan-tagline"]}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button
        className={styles["upgrade-button"]}
        disabled={isGuest}
        style={{ cursor: isGuest ? "default" : "pointer" }}
      >
        Upgrade
      </button>
    </>
  );
}

CurrentPlan.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default CurrentPlan;
