import AnalyticsCard from "./AnalyticsCard";
import styles from "./Analytics.module.css";
import { useState, useEffect } from "react";

function Analytics() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/catalog/stats", {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        setStats(json.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className={styles.analytics} data-testid="analytics">
      {stats.map((item) => (
        <AnalyticsCard key={item.title} title={item.title} api={item.value} />
      ))}
    </div>
  );
}

export default Analytics;
