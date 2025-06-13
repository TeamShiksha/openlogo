import styles from "./OperatorCard.module.css";
import PropTypes from "prop-types";
import Button from "../common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
const OperatorCard = ({ item, onRespondClick, searchType }) => {
  const isArchived = item.status === "RESOLVED" || item.status === "REJECTED";

  const displayMessage =
    searchType === "requests"
      ? `Company URL: ${item.companyUrl}`
      : item.message;

  const statusClassName = () => {
    switch (item.status) {
      case "RESOLVED":
        return styles["status-resolved"];
      case "REJECTED":
        return styles["status-rejected"];
      case "PENDING":
        return styles["status-pending"];
      default:
        return "";
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles["status-container"]}>
          <div className={styles["status-container-left"]}>
            <span className={styles["request-id"]}>{item._id}</span>
            <span className={`${styles.status} ${statusClassName()}`}>
              {item.status}
            </span>
          </div>
          <div className={styles["date-container"]}>
            <p>Opened at : {new Date(item.openedAt).toLocaleDateString()}</p>
            {item.status !== "PENDING" && (
              <p>Closed at : {new Date(item.closedAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        {searchType !== "requests" && (
          <div className={styles.header}>
            <div className={styles["user-info"]}>
              <p className={styles["user-name"]}>{item.name}</p>
              <p className={styles.divider}></p>
              <p className={styles["user-email"]}>{item.email}</p>
            </div>
          </div>
        )}
        <div className={styles["message-container"]}>
          <p className={styles["message-title"]}>
            {searchType === "messages" ? "Message" : ""}
          </p>
          <p className={styles.message}>{displayMessage}</p>
        </div>
        {isArchived && (
          <div className={styles["summary-container"]}>
            <p className={styles["summary-title"]}>Summary</p>
            <p className={styles.summary}>{item.comment}</p>
          </div>
        )}
        <div className={styles["button-container"]}>
          {!isArchived && (
            <div className={styles["button-container"]}>
              <Button
                onClick={() => onRespondClick(item, "respond")}
                variant="primary"
                className={styles["respond-button"]}
              >
                {BUTTON_TEXT.respond}
              </Button>
              <Button
                onClick={() => onRespondClick(item, "reject")}
                variant="danger"
                className={styles["reject-button"]}
              >
                {BUTTON_TEXT.reject}
              </Button>
            </div>
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
