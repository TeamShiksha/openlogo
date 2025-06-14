import PropTypes from "prop-types";
import styles from "./CatalogItem.module.css";
import Button from "../common/button/Button";
import { formatDate } from "../../utils/Helpers";
function CatalogItem({ company }) {
  return (
    <div className={styles["catalog-item"]}>
      <div className={styles["catalog-item-column-first"]}>
        {company.company_name}.{company.extension}
      </div>
      <div className={styles["catalog-item-inner"]}>
        <div className={styles["created"]}>
          {formatDate(company.created_at)}
        </div>
        <div className={styles["updated"]}>
          {formatDate(company.updated_at)}
        </div>
      </div>
      <div className={styles["catalog-item-column-last"]}>
        <Button variant="primary" className={styles["reupload-btn"]}>
          Reupload
        </Button>
      </div>
    </div>
  );
}

CatalogItem.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    companyImage: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default CatalogItem;
