import { useState } from "react";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import searchLogo from "../../assets/searchIcon.svg";
import { companies } from "../../utils/constants";
import styles from "./Catalog.module.css";
import CatalogItem from "./CatalogItem";

function Catalog() {
  const limit = 10;
  const totalPages = Math.floor(companies.length / 10);
  const [pageNum, setPageNum] = useState(0);

  const skip = pageNum;
  const skipCount = skip * limit;

  const companiesInfo = companies.slice(
    skipCount,
    Math.min(skipCount + limit, companies.length)
  );

  const handlePreviousBtnClick = () => {
    if (pageNum == 0) {
      return;
    }
    setPageNum((prevPageNum) => prevPageNum - 1);
  };
  const handleNextBtnClick = () => {
    if (pageNum == totalPages) {
      return;
    }
    setPageNum((prevPageNum) => prevPageNum + 1);
  };

  return (
    <div className={styles["catalog-wrapper"]}>
      {/*catalog search bar*/}
      <div className={styles["catalog-search"]}>
        <img
          src={searchLogo}
          alt="search-logo"
          className={styles["search-icon"]}
        />
        <input type="text" placeholder="Search" />
        <button>Add image</button>
      </div>
      {/* catalog table */}
      <div className={styles["catalog-table-wrapper"]}>
        {/* catalog table header */}
        <div className={styles["catalog-table-header"]}>
          <div className={styles["catalog-table-column-first"]}>
            Images
            <span className={styles["companies-count"]}>
              {companies.length}
            </span>
          </div>
          <div className={styles["catalog-table-header-inner"]}>
            <div>Created</div>
            <div>Updated</div>
          </div>
          {/* empty table header for reupload button column */}
          <div className={styles["catalog-table-column-last"]}></div>
        </div>
        {/* catalog table */}
        {companiesInfo.map((company) => {
          return <CatalogItem key={company.id} company={company} />;
        })}
        {/* catalog table footer */}
        <div className={styles["catalog-table-footer"]}>
          <button
            onClick={(e) => handlePreviousBtnClick(e)}
            className={`${pageNum === 0 && styles["catalog-footer-nav-btn-disable"]} ${styles["catalog-footer-nav-btn"]} ${styles["catalog-nav-left-arrow"]}`}
          >
            <img src={leftArrow} alt="left-arrow" />
          </button>
          <div>
            Page {pageNum + 1} of {totalPages + 1}
          </div>
          <button
            onClick={(e) => handleNextBtnClick(e)}
            className={`${pageNum === totalPages && styles["catalog-footer-nav-btn-disable"]} ${styles["catalog-footer-nav-btn"]} ${styles["catalog-nav-right-arrow"]}`}
          >
            <img src={rightArrow} alt="right-arrow" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Catalog;
