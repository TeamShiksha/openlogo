import AnalyticsCard from "./AnalyticsCard";
import styles from "./Analytics.module.css";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";

function Analytics() {
  const [stats, setStats] = useState([]);
  const { makeRequest, data } = useApi({
    method: "GET",
    url: "/catalog/stats",
  });

  useEffect(() => {
    makeRequest().catch((err) => {
      console.error("Error fetching analytics data:", err);
    });
  }, []);

  useEffect(() => {
    if (data) {
      setStats(data.data);
    }
  }, [data]);

  return (
    <div className={styles.analytics} data-testid="analytics">
      {stats.map((item) => (
        <AnalyticsCard key={item.title} title={item.title} api={item.value} />
      ))}
    </div>
  );
}

export default Analytics;
