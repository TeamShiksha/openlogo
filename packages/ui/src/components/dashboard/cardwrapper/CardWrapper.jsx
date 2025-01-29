import styles from "./CardWrapper.module.css";

function CardWrapper({ title, children, status, statusStyle }) {
  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        {status && (
          <span style={statusStyle} className={styles.cardStatus}>
            {status}
          </span>
        )}
      </div>
      <div className={styles.cardContent}>{children}</div>
    </div>
  );
}

export default CardWrapper;
