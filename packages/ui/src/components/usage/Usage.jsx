import PropTypes from "prop-types";
import PieGraph from "./PieGraph";
import styles from "./Usage.module.css";
import { USAGE } from "../../utils/Constants";

function Usage({ usageCount, usageLimit }) {
  const percentage = (usageCount / usageLimit) * 100;
  return (
    <>
      <div className={styles["usage-body-container"]}>
        <div className={styles["circular-chart"]}>
          <PieGraph
            percentage={percentage}
            colour="var(--primary)"
            fill="var(--border)"
          />
        </div>
        <div className={styles["usage-statistics"]}>
          <div>
            <div className={styles["data-heading"]}>{USAGE.callsText}</div>
            <div className={styles.data}>{usageCount}</div>
          </div>
          <div>
            <div className={styles["data-heading"]}>{USAGE.limitText}</div>
            <div className={styles.data}>{usageLimit}</div>
          </div>
        </div>
      </div>
      <div className={styles["dashboard-reset-date"]}>{USAGE.resetText}</div>
    </>
  );
}

Usage.propTypes = {
  usageCount: PropTypes.number,
  usageLimit: PropTypes.number,
};

export default Usage;
