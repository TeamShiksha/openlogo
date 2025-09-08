import { BUTTON_TEXT, CURRENT_PLAN } from "../../utils/Constants";
import styles from "./CurrentPlan.module.css";
import PropTypes from "prop-types";
import Button from "../common/button/Button";

function CurrentPlan({ isGuest }) {
  const keepBtnDisabled = true;
  return (
    <>
      <p className={styles["current-plan"]}>{CURRENT_PLAN.plan}</p>
      <p className={styles["current-plan-tagline"]}>{CURRENT_PLAN.tagline}</p>

      <Button
        className={styles["upgrade-button"]}
        variant={"primary"}
        disabled={keepBtnDisabled || isGuest}
        style={{ cursor: isGuest ? "default" : "pointer" }}
      >
        {BUTTON_TEXT.upgrade}
      </Button>
    </>
  );
}

CurrentPlan.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default CurrentPlan;
