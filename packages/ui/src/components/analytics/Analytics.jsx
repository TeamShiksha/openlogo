import styles from "./Analytics.module.css";
import AnalyticsCard from "./AnalyticsCard";
import { INFO } from "../../utils/Constants";

export default function Analytics() {
  return (
    <div className={styles.analyticSection}>
      {INFO.map((item) => (
        <AnalyticsCard key={item.title} title={item.title} api={item.api} />
      ))}
    </div>
  );
}
