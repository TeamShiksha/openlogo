import PropTypes from "prop-types";
import PieGraph from "./PieGraph";
import styles from "./Usage.module.css";
import { USAGE } from "../../utils/Constants";
import { useEffect, useRef, useMemo } from "react";
import { useToast } from "../../hooks/useToast.js";

function Usage({ usageCount, usageLimit }) {
  const percentage = useMemo(
    () => (usageCount / usageLimit) * 100,
    [usageCount, usageLimit]
  );
  const toast = useToast();
  const notifiedRef = useRef({ 80: false, 90: false, 95: false, 100: false });

  useEffect(() => {
    if (!Number.isFinite(percentage) || usageLimit <= 0 || !toast) return;

    const thresholds = [
      { p: 100, type: "error" },
      { p: 95, type: "error" },
      { p: 90, type: "warning" },
      { p: 80, type: "warning" },
    ];

    const crossedThreshold = thresholds.find(({ p }) => percentage >= p);

    if (crossedThreshold) {
      const { p, type } = crossedThreshold;

      if (!notifiedRef.current[p]) {
        const msg = `You have used ${Math.floor(percentage)}% of your monthly API limit (${usageCount}/${usageLimit}).`;
        toast[type](msg);

        thresholds.forEach((t) => {
          if (t.p <= p) {
            notifiedRef.current[t.p] = true;
          }
        });
      }
    }
  }, [percentage, usageCount, usageLimit, toast]);

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
