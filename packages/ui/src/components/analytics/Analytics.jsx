import AnalyticsCard from "./AnalyticsCard";
import styles from "./Analytics.module.css";
import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

function Analytics() {
  const toast = useToast();
  const [stats, setStats] = useState([]);
  const { makeRequest, data, error } = useApi({
    method: "GET",
    url: "/catalog/stats",
  });

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  useEffect(() => {
    makeRequest();
  }, [makeRequest]);

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
