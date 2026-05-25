import AnalyticsCard from "./AnalyticsCard";
import styles from "./Analytics.module.css";
import { useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

function Analytics() {
  const toast = useToast();
  const { makeRequest, data, errorMsg } = useApi({
    method: "GET",
    url: "/catalog/stats",
  });
  const stats = data?.data || [];

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg, toast]);

  useEffect(() => {
    makeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
