import styles from "./CardWrapper.module.css";
import PropTypes from "prop-types";

function CardWrapper({ title, children, status = "", statusClass = "" }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <p className={styles.title}>{title}</p>
        {status && (
          <span className={`${styles.status} ${statusClass}`}>{status}</span>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}

CardWrapper.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  status: PropTypes.string,
  statusClass: PropTypes.string,
};

export default CardWrapper;
