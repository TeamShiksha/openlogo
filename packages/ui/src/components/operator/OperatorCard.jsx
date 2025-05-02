import styles from "./OperatorCard.module.css";
import PropTypes from "prop-types";

const OperatorCard = ({ item, onRespondClick, searchType }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return styles["status-pending"];
      case "IN_PROGRESS":
        return styles["status-in-progress"];
      case "RESOLVED":
        return styles["status-resolved"];
      case "REJECTED":
        return styles["status-rejected"];
      default:
        return "";
    }
  };

  const isArchived = item.status === "RESOLVED" || item.status === "REJECTED";

  const displayMessage =
    searchType === "requests"
      ? `Company URL: ${item.companyUrl}`
      : item.message;

  return (
    <div className={styles.card}>
      <span className={`${styles.status} ${getStatusClass(item.status)}`}>
        {item.status}
      </span>
      <div className={styles.content}>
        <p className={styles.message}>{displayMessage}</p>
        <p className={styles.date}>
          <span>Date:</span> {new Date(item.created_at).toLocaleDateString()}
        </p>
        <div className={styles["button-container"]}>
          {!isArchived && (
            <button
              className={styles.respondButton}
              onClick={() => onRespondClick(item)}
            >
              Respond
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperatorCard;

OperatorCard.propTypes = {
  item: PropTypes.object.isRequired,
  onRespondClick: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};
