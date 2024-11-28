import styles from "./Analytics.module.css";
import AnalyticsCard from "./AnalyticsCard";

import { INFO } from "../../src/utils/constants";

export default function Analytics() {
  return (
    <div className={styles.container}>
      <div className={styles.analyticSection}>
        <div className={styles.cardGroup}>
          {INFO.slice(0, 2).map((item, index) => (
            <AnalyticsCard key={index} title={item.title} api={item.api} />
          ))}
        </div>
        <div className={styles.cardGroup}>
          {INFO.slice(2).map((item, index) => (
            <AnalyticsCard key={index + 2} title={item.title} api={item.api} />
          ))}
        </div>
      </div>
    </div>
  );
}
