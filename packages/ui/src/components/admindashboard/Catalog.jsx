import { useState } from "react";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import searchLogo from "../../assets/searchIcon.svg";
import { companies } from "../../utils/constants";
import styles from "./Catalog.module.css";
import CatalogItem from "./CatalogItem";
import ImageUploadModal from "./ImageUploadModal";

function Catalog() {
  const [pageNum, setPageNum] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const limit = 10;
  const totalPages = Math.floor(companies.length / 10);

  const skip = pageNum;
  const skipCount = skip * limit;

  const companiesInfo = companies.slice(
    skipCount,
    Math.min(skipCount + limit, companies.length)
  );
  const filteredCompanies = companiesInfo.filter((company) =>
    company.companyImage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchTermChange = (inputChangeEvent) => {
    setSearchTerm(inputChangeEvent.target.value);
  };

  const handlePreviousBtnClick = () => {
    if (pageNum == 0) {
      return;
    }
    setSearchTerm("");
    setPageNum((prevPageNum) => prevPageNum - 1);
  };

  const handleNextBtnClick = () => {
    if (pageNum == totalPages) {
      return;
    }
    setSearchTerm("");
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
        <input
          value={searchTerm}
          type="search"
          placeholder="Search"
          onChange={(e) => handleSearchTermChange(e)}
        />
        <button onClick={() => setIsModalOpen(true)}>Add image</button>
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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
        {filteredCompanies.length > 0 &&
          filteredCompanies.map((company) => {
            return <CatalogItem key={company.id} company={company} />;
          })}
        {filteredCompanies.length === 0 && (
          <p className={styles["catalog-table-no-content"]}>
            No results found matching your query!
          </p>
        )}
        {/* catalog table footer */}
        <div className={styles["catalog-table-footer"]}>
          <button
            onClick={handlePreviousBtnClick}
            className={`${pageNum === 0 && styles["catalog-footer-nav-btn-disable"]} ${styles["catalog-footer-nav-btn"]} ${styles["catalog-nav-left-arrow"]}`}
          >
            <img src={leftArrow} alt="left-arrow" />
          </button>
          <div>
            Page <span className={styles["cur-page"]}>{pageNum + 1}</span> of{" "}
            {totalPages + 1}
          </div>
          <button
            onClick={handleNextBtnClick}
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
