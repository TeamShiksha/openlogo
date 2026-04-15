import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./CatalogItem.module.css";
import Button from "../common/button/Button";
import { formatDate } from "../../utils/Helpers";
function CatalogItem({ company, onUpdate }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={styles["catalog-item"]}>
      <div className={styles["catalog-item-column-first"]}>
        <div className={styles["preview-placeholder"]}>
          {company.imageUrl && !imageError ? (
            <img
              src={company.imageUrl}
              alt={company.company_name}
              className={styles["preview-image"]}
              onError={() => setImageError(true)}
            />
          ) : (
            <span className={styles["preview-fallback"]}>
              {company.company_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className={styles["name-text"]}>
            {company.company_name.toLowerCase()}.{company.extension}
          </p>
          <p className={styles["meta-text"]}>
            {company.extension.toUpperCase()} • Logo Asset
          </p>
        </div>
      </div>
      <div className={styles["catalog-item-inner"]}>
        <div>{formatDate(company.created_at)}</div>
        <div>{formatDate(company.updated_at)}</div>
      </div>
      <div className={styles["catalog-item-column-last"]}>
        <Button
          onClick={() => onUpdate(company._id, company.company_uri)}
          variant="primary"
          className={styles["reupload-btn"]}
        >
          Reupload
        </Button>
      </div>
    </div>
  );
}

CatalogItem.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    company_name: PropTypes.string.isRequired,
    company_uri: PropTypes.string.isRequired,
    extension: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CatalogItem;
