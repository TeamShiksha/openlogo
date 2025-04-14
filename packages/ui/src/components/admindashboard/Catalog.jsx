import { useState } from "react";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import searchLogo from "../../assets/searchIcon.svg";
import { companies } from "../../utils/Constants";
import styles from "./Catalog.module.css";
import CatalogItem from "./CatalogItem";
import ImageUploadModal from "./ImageUploadModal";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";

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
    <div className={styles["catalog-wrapper"]} data-testid="catalog">
      {/*catalog search bar*/}
      <div className={styles["catalog-search"]}>
        <img
          src={searchLogo}
          alt="search-logo"
          className={styles["search-icon"]}
        />
        <CustomInput
          type="search"
          label="search"
          name="search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="primary"
          className={styles["catalog-add-image-btn"]}
        >
          Add image
        </Button>
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      {/* catalog table */}
      <div className={styles["catalog-table-wrapper"]}>
        {/* catalog table header */}
        <div className={styles["catalog-table-header"]}>
          <div className={styles["catalog-table-column-first"]}>Images</div>
          <div className={styles["catalog-table-header-inner"]}>
            <div>Created</div>
            <div>Updated</div>
          </div>
          {/* empty table header for reupload button column */}
          <div className={styles["catalog-table-column-last"]}></div>
        </div>
        {/* catalog table content */}
        <div className={styles["catalog-table-content"]}>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <CatalogItem key={company.id} company={company} />
            ))
          ) : (
            <p className={styles["catalog-table-no-content"]}>
              No results found matching your query!
            </p>
          )}
        </div>
        {/* catalog table footer */}
        <div className={styles["catalog-table-footer"]}>
          <button
            onClick={handlePreviousBtnClick}
            className={`${pageNum === 0 && styles["catalog-footer-nav-btn-disable"]} ${styles["catalog-footer-nav-btn"]} ${styles["catalog-nav-left-arrow"]}`}
          >
            <img src={leftArrow} alt="left-arrow" />
          </button>
          <div>
            Page{" "}
            <span data-testid="current-page" className={styles["cur-page"]}>
              {pageNum + 1}
            </span>{" "}
            of {totalPages + 1}
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
