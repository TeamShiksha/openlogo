import PropTypes from "prop-types";
import PieGraph from "./PieGraph";
import styles from "./Usage.module.css";
import { USAGE } from "../../utils/Constants";
import { useContext, useEffect, useMemo } from "react";
import { useToast } from "../../hooks/useToast.js";
import { UserContext } from "../../contexts/Contexts.jsx";

const THRESHOLDS = [
  { p: 100, type: "error" },
  { p: 95, type: "error" },
  { p: 90, type: "warning" },
  { p: 80, type: "warning" },
];

function Usage({ usageCount, usageLimit }) {
  const { userData } = useContext(UserContext);
  const percentage = useMemo(
    () => (usageCount / usageLimit) * 100,
    [usageCount, usageLimit]
  );
  const toast = useToast();

  const billingCycleStartDate = useMemo(() => {
    if (!userData?.subscription?.updated_at) return null;
    return userData.subscription.updated_at;
  }, [userData?.subscription?.updated_at]);

  useEffect(() => {
    if (
      !Number.isFinite(percentage) ||
      usageLimit <= 0 ||
      !toast ||
      !billingCycleStartDate
    )
      return;

    const crossedThreshold = THRESHOLDS.find(({ p }) => percentage >= p);

    if (crossedThreshold) {
      const { p, type } = crossedThreshold;

      const cycleStartDate = new Date(billingCycleStartDate);
      const cycleId = cycleStartDate.toISOString().split("T")[0];
      const storageKey = `usage_limit_notification_${p}_cycle_${cycleId}`;

      const hasShownThisCycle = localStorage.getItem(storageKey);

      if (!hasShownThisCycle) {
        const msg = `You have used ${Math.floor(percentage)}% of your monthly API limit (${usageCount}/${usageLimit}).`;
        toast[type](msg);
        localStorage.setItem(storageKey, "true");
      }
    }
  }, [percentage, usageCount, usageLimit, toast, billingCycleStartDate]);

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
