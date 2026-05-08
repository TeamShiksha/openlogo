import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner.jsx";
import styles from "./UserSubscriptions.module.css"; // reuse shared table/badge/pagination styles
import { SUBSCRIPTION_LOGS } from "../../utils/Constants.js";

const ITEMS_PER_PAGE = 10;

function PlanBadge({ plan }) {
  const badgeClass =
    plan === "PRO" ? styles["plan-badge-pro"] : styles["plan-badge-hobby"];
  const label = SUBSCRIPTION_LOGS.plans[plan] ?? plan;
  return (
    <span className={`${styles["plan-badge"]} ${badgeClass}`}>{label}</span>
  );
}

PlanBadge.propTypes = {
  plan: PropTypes.string.isRequired,
};

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function SubscriptionLogs() {
  const toast = useToast();

  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const { fetchRequest, loading } = useApi({
    method: "GET",
    url: `/admin/users/subscription/logs?page=${page}&limit=${ITEMS_PER_PAGE}`,
  });

  useEffect(() => {
    const load = async () => {
      const { success, data, error } = await fetchRequest();
      if (success && data) {
        setLogs(data.data ?? []);
        setTotalPages(data.totalPages ?? 1);
      } else if (error) {
        toast.error(error);
      }
      setInitialized(true);
    };
    load();
    // fetchRequest and toast are stable refs; only page drives reload
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div data-testid="subscription-logs-panel">
      {/* Header */}
      <div className={styles["panel-header"]}>
        <div className={styles["panel-title-group"]}>
          <h2 className={styles["panel-title"]}>{SUBSCRIPTION_LOGS.title}</h2>
          <p className={styles["panel-subtitle"]}>
            {SUBSCRIPTION_LOGS.subtitle}
          </p>
        </div>
      </div>

      {/* Table / loading / empty */}
      {loading || !initialized ? (
        <div className={styles["loading-container"]}>
          <LoadingSpinner size={36} border={3} color="var(--primary)" />
        </div>
      ) : logs.length === 0 ? (
        <p className={styles["empty-state"]}>{SUBSCRIPTION_LOGS.emptyState}</p>
      ) : (
        <div className={styles["table-wrapper"]}>
          <table className={styles.table}>
            <thead>
              <tr>
                {SUBSCRIPTION_LOGS.tableHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  {/* Date */}
                  <td>
                    <span className={styles["usage-text"]}>
                      {formatDate(log.createdAt)}
                    </span>
                  </td>

                  {/* User */}
                  <td>
                    <p className={styles["user-name"]}>
                      {log.user_id?.name ?? "—"}
                    </p>
                    <p className={styles["user-email"]}>
                      {log.user_id?.email ?? ""}
                    </p>
                  </td>

                  {/* Changed By */}
                  <td>
                    <p className={styles["user-name"]}>
                      {log.changed_by?.name ?? "—"}
                    </p>
                    <p className={styles["user-email"]}>
                      {log.changed_by?.email ?? ""}
                    </p>
                  </td>

                  {/* From */}
                  <td>
                    <PlanBadge plan={log.from_plan} />
                  </td>

                  {/* To */}
                  <td>
                    <PlanBadge plan={log.to_plan} />
                  </td>

                  {/* Reason */}
                  <td>
                    <span className={styles["usage-text"]}>
                      {log.reason ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles["page-btn"]}
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label="Previous page"
          >
            &laquo;
          </button>
          <span className={styles["page-indicator"]}>
            Page {page} of {totalPages}
          </span>
          <button
            className={styles["page-btn"]}
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            aria-label="Next page"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default SubscriptionLogs;
