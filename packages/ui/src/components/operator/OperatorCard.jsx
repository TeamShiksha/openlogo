import styles from "./OperatorCard.module.css";
import PropTypes from "prop-types";

const OperatorCard = ({ item, onRespondClick, searchType }) => {
  const isArchived = item.status === "RESOLVED" || item.status === "REJECTED";

  const displayMessage =
    searchType === "requests"
      ? `Company URL: ${item.companyUrl}`
      : item.message;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        {searchType !== "requests" && (
          <div className={styles.userInfo}>
            <p className={styles.userName}>
              <span>Name:</span> {item.name}
            </p>
            <p className={styles.userEmail}>
              <span>Email:</span> {item.email}
            </p>
          </div>
        )}
        <p className={styles.message}>{displayMessage}</p>
        <p className={styles.date}>
          <span>Date:</span> {new Date(item.updated_at).toLocaleDateString()}
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
