import styles from "./Analytics.module.css";
import AnalyticsCard from "./AnalyticsCard";

import { INFO } from "../../src/utils/constants";

export default function Analytics() {
  return (
    <div className={styles.container}>
      <div className={styles.analyticSection}>
        {INFO.map((item, index) => (
          <AnalyticsCard key={index} title={item.title} api={item.api} />
        ))}
      </div>
    </div>
  );
}
