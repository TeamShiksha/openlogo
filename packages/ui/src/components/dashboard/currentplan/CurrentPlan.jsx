import styles from "./CurrentPlan.module.css";
import PropTypes from "prop-types";

function CurrentPlan({ role }) {
  return (
    <>
      <p className={styles["current-plan"]}>Hobby</p>
      <p className={styles["current-plan-tagline"]}>
        Empower your projects with essential tools, at no cost.
      </p>
      <button
        className={styles["upgrade-button"]}
        disabled={role == "GUEST"}
        style={{ cursor: role == "GUEST" ? "default" : "pointer" }}
      >
        Upgrade
      </button>
    </>
  );
}

CurrentPlan.propTypes = {
  role: PropTypes.string.isRequired,
};

export default CurrentPlan;
