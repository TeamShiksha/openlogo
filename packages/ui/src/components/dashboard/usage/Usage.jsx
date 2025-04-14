import { useContext, useMemo } from "react";
import PieGraph from "../PieGraph";
import styles from "./Usage.module.css";
import { UserContext } from "../../../contexts/Contexts";

function Usage() {
  const { userData, loading } = useContext(UserContext);

  const { usedInPercent, usageCount } = useMemo(() => {
    let usedInPercent = 0;
    let usageCount = 0;

    if (!loading && userData) {
      usedInPercent =
        (userData.subscription.usage_count /
          userData.subscription.usage_limit) *
        100;
      usageCount = userData.subscription?.usage_count;
    }
    return { usedInPercent, usageCount };
  }, [userData, loading]);

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <>
      <div className={styles.usageBodyContainer}>
        <div className={styles.circularChart}>
          <PieGraph
            percentage={usedInPercent}
            colour="var(--primary)"
            fill="var(--border)"
          />
        </div>
        <div className={styles.usageStatistics}>
          <div className={styles.dataHeading}>Calls</div>
          <div className={styles.data}>{usageCount}</div>
          <div className={styles.dataHeading}>Limit</div>
          <div className={styles.data}>
            {!loading ? userData?.subscription?.usage_limit : 0}
          </div>
        </div>
      </div>
      <div className={styles.dashboardResetDate}>
        Resets 1st of every month.
      </div>
    </>
  );
}

export default Usage;
