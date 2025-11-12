import styles from "./OperatorCard.module.css";
import PropTypes from "prop-types";
import Button from "../common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
import { formatDate } from "../../utils/Helpers";
const OperatorCard = ({ item, onRespondClick, searchType }) => {
  const isArchived = item.status === "RESOLVED" || item.status === "REJECTED";

  const displayMessage =
    searchType === "requests" ? item.companyUrl : item.message;

  const statusClassName = () => {
    switch (item.status) {
      case "RESOLVED":
        return {
          ballClass: styles["ball-resolved"],
          textClass: styles["text-resolved"],
        };
      case "REJECTED":
        return {
          ballClass: styles["ball-rejected"],
          textClass: styles["text-rejected"],
        };
      case "PENDING":
        return {
          ballClass: styles["ball-pending"],
          textClass: styles["text-pending"],
        };
      default:
        return {
          ballClass: "",
          textClass: "",
        };
    }
  };

  const { ballClass, textClass } = statusClassName();

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div className={styles["status-container"]}>
          <div className={styles["status-container-left"]}>
            <span className={styles["request-id"]}>
              Ticket #{item._id.slice(-8)}
            </span>
            <div className={`${styles["status-ball"]} ${ballClass}`}></div>
            <span className={`${styles.status} ${textClass}`}>
              {item.status}
            </span>
          </div>
          <div className={styles["date-container"]}>
            <p>{formatDate(item.openedAt)}</p>
            {item.status !== "PENDING" && (
              <p>
                {" - "}
                {formatDate(item.closedAt)}
              </p>
            )}
          </div>
        </div>
        <div className={styles["operator-card-body"]}>
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
              {searchType === "messages" ? "Message" : "Company URL"}
            </p>
            {searchType === "messages" ? (
              <p className={styles.message}>{displayMessage}</p>
            ) : (
              <a
                href={`${displayMessage}`}
                target="_blank"
                className={styles["company-url"]}
              >
                {displayMessage}
              </a>
            )}
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
    </div>
  );
};

export default OperatorCard;

OperatorCard.propTypes = {
  item: PropTypes.object.isRequired,
  onRespondClick: PropTypes.func.isRequired,
  searchType: PropTypes.string.isRequired,
};
