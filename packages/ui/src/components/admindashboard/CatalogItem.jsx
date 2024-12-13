import PropTypes from "prop-types";
import styles from "./CatalogItem.module.css";

function CatalogItem({ company }) {
  return (
    <div className={styles["catalog-item"]}>
      <div className={styles["catalog-item-column-first"]}>
        {company.companyImage}
      </div>
      <div className={styles["catalog-item-inner"]}>
        <div className={styles["created"]}>{company.createdAt}</div>
        <div className={styles["updated"]}>{company.updatedAt}</div>
      </div>
      <div className={styles["catalog-item-column-last"]}>
        <button className={styles["reupload-btn"]}>Reupload</button>
      </div>
    </div>
  );
}

CatalogItem.propTypes = {
  company: PropTypes.shape({
    id: PropTypes.string.isRequired,
    companyImage: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default CatalogItem;
