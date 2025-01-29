import styles from "./CardWrapper.module.css";

function CardWrapper({ title, children, status, statusClass }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {status && (
          <span className={`${styles.cardStatus} ${statusClass}`}>
            {status}
          </span>
        )}
      </div>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}

export default CardWrapper;
