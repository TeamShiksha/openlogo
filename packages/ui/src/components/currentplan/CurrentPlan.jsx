import { BUTTON_TEXT, CURRENT_PLAN } from "../../utils/Constants";
import styles from "./CurrentPlan.module.css";
import PropTypes from "prop-types";

function CurrentPlan({ isGuest }) {
  return (
    <>
      <p className={styles["current-plan"]}>{CURRENT_PLAN.plan}</p>
      <p className={styles["current-plan-tagline"]}>{CURRENT_PLAN.tagline}</p>
      <button
        className={styles["upgrade-button"]}
        disabled={isGuest}
        style={{ cursor: isGuest ? "default" : "pointer" }}
      >
        {BUTTON_TEXT.upgrade}
      </button>
    </>
  );
}

CurrentPlan.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default CurrentPlan;
