import AnalyticsCard from "./AnalyticsCard";
import { ANALYTIC_CARDS } from "../../utils/Constants";
import styles from "./Analytics.module.css";

function Analytics() {
  return (
    <div className={styles.analytics} data-testid="analytics">
      {ANALYTIC_CARDS.map((item) => (
        <AnalyticsCard key={item.title} title={item.title} api={item.api} />
      ))}
    </div>
  );
}

export default Analytics;
