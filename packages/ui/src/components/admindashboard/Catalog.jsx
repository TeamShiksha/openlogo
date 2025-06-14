import { useEffect, useState } from "react";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import searchLogo from "../../assets/searchIcon.svg";
import styles from "./Catalog.module.css";
import CatalogItem from "./CatalogItem";
import ImageUploadModal from "./ImageUploadModal";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { useApi } from "../../hooks/useApi";

function Catalog() {
  const [pageNum, setPageNum] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const limit = 10;
  const skip = pageNum * limit;

  const { data, loading, errorMsg, makeRequest } = useApi({
    method: "GET",
    // url: `/catalog/logos?skip=${skip}&limit=${limit}`,
    url: `/catalog/logos?skip=0&limit=0`,
  });

  const {
    data: uploadData,
    loading: uploadLoading,
    errorMsg: uploadErrorMsg,
    makeRequest: uploadMakeRequest,
  } = useApi({
    method: "POST",
    url: `/catalog/logo`,
    headers: { "Content-Type": "multipart/form-data" }, // Set headers for file upload
  });

  useEffect(() => {
    makeRequest();
  }, [pageNum]);

  useEffect(() => {
    if (data?.data?.totalPages) {
      setTotalPages(data.data.totalPages - 1); // Adjust for 0-based indexing
    }
  }, [data]);

  const handleImageUpload = async ({ file, companyUri }) => {
    if (!file || !companyUri) return;

    const formData = new FormData();
    formData.append("logo", file); // Adjust the field name based on your API's requirements
    formData.append("companyUri", companyUri);

    try {
      const success = await uploadMakeRequest({ data: formData }); // Pass FormData dynamically
      if (success) {
        setIsModalOpen(false); // Close modal on successful upload
        makeRequest(); // Refresh catalog data after upload
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSearchTermChange = (inputChangeEvent) => {
    setSearchTerm(inputChangeEvent.target.value);
  };

  const handlePreviousBtnClick = () => {
    if (pageNum > 0) {
      setSearchTerm("");
      setPageNum((prev) => prev - 1);
    }
  };

  const handleNextBtnClick = () => {
    if (pageNum < totalPages) {
      setSearchTerm("");
      setPageNum((prev) => prev + 1);
    }
  };

  console.log({ pageNum, totalPages });

  const filteredCompanies =
    data?.data?.data?.length > 0
      ? data.data.data.filter((company) =>
          company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];

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
          onUpload={handleImageUpload}
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
              <CatalogItem key={company._id} company={company} />
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
            disabled={pageNum === totalPages}
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
