import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "../common/modal/Modal.jsx";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner.jsx";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { IMAGE_REWARD_MODAL } from "../../utils/Constants.js";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./ImageRewardModal.module.css";

const TRANSACTIONS_PER_PAGE = 10;

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTransactionType(type) {
  const typeMap = {
    MILESTONE_REWARD: "Milestone",
    MANUAL_ADJUSTMENT: "Adjustment",
    REVERSAL: "Reversal",
    BONUS: "Bonus",
  };
  return typeMap[type] || type;
}

function ImageRewardModal({ isOpen, onClose, imageId, imageName }) {
  const toast = useToast();
  const [page, setPage] = useState(1);

  const { fetchRequest: fetchSummary, data: summaryData, loading: summaryLoading } = useApi({
    method: "GET",
    url: `/rewards/summary/image/${imageId}`,
  });

  const { fetchRequest: fetchTransactions, data: transactionsData, loading: transactionsLoading } = useApi({
    method: "GET",
    url: `/rewards/transactions/image/${imageId}?page=${page}&limit=${TRANSACTIONS_PER_PAGE}`,
  });

  useEffect(() => {
    if (isOpen && imageId) {
      setPage(1);
      fetchSummary().then(({ success, error }) => {
        if (!success && error) {
          toast.error(IMAGE_REWARD_MODAL.toasts.summaryError);
        }
      });
      fetchTransactions().then(({ success, error }) => {
        if (!success && error) {
          toast.error(IMAGE_REWARD_MODAL.toasts.transactionsError);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, imageId]);

  useEffect(() => {
    if (isOpen && imageId && page > 1) {
      fetchTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const summary = summaryData?.data;
  const transactions = transactionsData?.data?.data || [];
  const totalPages = transactionsData?.data?.totalPages || 1;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customWidth="720px"
      data-testid="image-reward-modal"
    >
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <h2 className={styles["modal-title"]}>
            {IMAGE_REWARD_MODAL.title}
          </h2>
          <p className={styles["modal-subtitle"]}>
            {imageName || IMAGE_REWARD_MODAL.subtitle}
          </p>
        </div>

        <div className={styles["summary-section"]}>
          {summaryLoading ? (
            <div className={styles["loading-container"]}>
              <LoadingSpinner size={32} border={3} color="var(--primary)" />
            </div>
          ) : summary ? (
            <div className={styles["summary-grid"]}>
              <div className={styles["stat-card"]}>
                <span className={styles["stat-value"]}>
                  {summary.uniqueProUsersCount || 0}
                </span>
                <span className={styles["stat-label"]}>
                  {IMAGE_REWARD_MODAL.summary.proUsers}
                </span>
              </div>
              <div className={styles["stat-card"]}>
                <span className={styles["stat-value"]}>
                  {summary.totalPointsAwarded || 0}
                </span>
                <span className={styles["stat-label"]}>
                  {IMAGE_REWARD_MODAL.summary.totalPoints}
                </span>
              </div>
              <div className={styles["stat-card"]}>
                <span className={styles["stat-value"]}>
                  {summary.milestonesAchieved?.length || 0}
                </span>
                <span className={styles["stat-label"]}>
                  {IMAGE_REWARD_MODAL.summary.milestones}
                </span>
              </div>
              <div className={styles["stat-card"]}>
                <span className={styles["stat-value"]}>
                  {summary.nextMilestone || "—"}
                </span>
                <span className={styles["stat-label"]}>
                  {IMAGE_REWARD_MODAL.summary.nextMilestone}
                </span>
              </div>
            </div>
          ) : (
            <p className={styles["empty-state"]}>No reward data available.</p>
          )}
        </div>

        <div className={styles["transactions-section"]}>
          <h3 className={styles["section-title"]}>
            {IMAGE_REWARD_MODAL.transactions.title}
          </h3>

          {transactionsLoading ? (
            <div className={styles["loading-container"]}>
              <LoadingSpinner size={32} border={3} color="var(--primary)" />
            </div>
          ) : transactions.length === 0 ? (
            <p className={styles["empty-state"]}>
              {IMAGE_REWARD_MODAL.transactions.emptyState}
            </p>
          ) : (
            <>
              <div className={styles["table-wrapper"]}>
                <table className={styles["table"]}>
                  <thead>
                    <tr>
                      {IMAGE_REWARD_MODAL.transactions.headers.map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx._id}>
                        <td>
                          <span className={styles["type-badge"]}>
                            {formatTransactionType(tx.transaction_type)}
                          </span>
                        </td>
                        <td className={styles["points-cell"]}>
                          {tx.points_awarded > 0 ? "+" : ""}
                          {tx.points_awarded}
                        </td>
                        <td>{tx.user_id?.name || tx.user_id?.email || "—"}</td>
                        <td>{tx.reason || "—"}</td>
                        <td>{formatDate(tx.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className={styles["pagination"]}>
                  <button
                    type="button"
                    className={styles["page-btn"]}
                    disabled={page === 1 || transactionsLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                  </button>
                  <span className={styles["page-indicator"]}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    className={styles["page-btn"]}
                    disabled={page === totalPages || transactionsLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

ImageRewardModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  imageId: PropTypes.string,
  imageName: PropTypes.string,
};

export default ImageRewardModal;
