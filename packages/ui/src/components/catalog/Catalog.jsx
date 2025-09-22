import { useEffect, useState } from "react";
import leftArrow from "../../assets/left-arrow.svg";
import rightArrow from "../../assets/right-arrow.svg";
import styles from "./Catalog.module.css";
import CatalogItem from "./CatalogItem";
import ImageUploadModal from "./ImageUploadModal";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner.jsx";
import { MESSAGES } from "../../utils/Constants.js";
import { useRef } from "react";

function Catalog() {
  const toast = useToast();
  const [pageNum, setPageNum] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [updateImageId, setUpdateImageId] = useState(null);
  const pageBeforeSearchRef = useRef(0);
  const limit = 10;
  const skip = pageNum * limit;

  const { data, loading, makeRequest, errorMsg } = useApi({
    method: "GET",
    url: `/catalog/logos?skip=${skip}&limit=${limit}&search=${searchTerm}`,
  });

  const {
    loading: uploadLoading,
    makeRequest: uploadMakeRequest,
    errorMsg: uploadErrorMsg,
  } = useApi({
    method: updateImageId ? "PUT" : "POST",
    url: `/catalog/logo`,
    headers: { "Content-Type": "multipart/form-data" },
  });

  useEffect(() => {
    makeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, searchTerm]);

  useEffect(() => {
    if (uploadErrorMsg) {
      toast.error(uploadErrorMsg);
    }
  }, [uploadErrorMsg, toast]);

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg, toast]);

  useEffect(() => {
    if (data?.data?.totalPages) {
      setTotalPages(data.data.totalPages - 1);
    }
  }, [data]);

  const handleImageUpload = async ({ file, companyUri }) => {
    if (!file || !companyUri) return;

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("companyUri", companyUri);

    try {
      const success = await uploadMakeRequest({ data: formData });
      if (success) {
        setIsModalOpen(false);
        setUpdateImageId(null);
        toast.success(MESSAGES.IMAGE_UPLOAD_SUCCESS);
        makeRequest();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleUpdateImage = async ({ file }) => {
    if (!file || !updateImageId) return;

    const formData = new FormData();
    formData.append("logo", file);
    formData.append("id", updateImageId);

    try {
      const success = await uploadMakeRequest({ data: formData });
      if (success) {
        setIsModalOpen(false);
        setUpdateImageId(null);
        toast.success(MESSAGES.IMAGE_UPDATE_SUCCESS);
        makeRequest();
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleSearchTermChange = (inputChangeEvent) => {
    const newSearchTerm = inputChangeEvent.target.value;
    const previousSearchTerm = searchTerm;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm !== "" && previousSearchTerm === "") {
      pageBeforeSearchRef.current = pageNum;
      setPageNum(0);
    } else if (newSearchTerm !== "" && previousSearchTerm !== "") {
      setPageNum(0);
    }
  };

  const handlePreviousBtnClick = () => {
    if (pageNum > 0) {
      setPageNum((prev) => prev - 1);
    }
  };

  const handleNextBtnClick = () => {
    if (pageNum < totalPages) {
      setPageNum((prev) => prev + 1);
    }
  };

  const handleReuploadBtnClick = (id) => {
    setIsModalOpen(true);
    setUpdateImageId(id);
  };

  return (
    <div className={styles["catalog-wrapper"]} data-testid="catalog">
      <div className={styles["catalog-search"]}>
        <CustomInput
          name="search"
          type="search"
          label="search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <Button
          onClick={() => {
            setUpdateImageId(null);
            setIsModalOpen(true);
          }}
          variant="primary"
          className={styles["catalog-add-image-btn"]}
        >
          Add image
        </Button>
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => {
            setUpdateImageId(null);
            setIsModalOpen(false);
          }}
          onUpload={updateImageId ? handleUpdateImage : handleImageUpload}
          isUpdate={!!updateImageId}
          isLoading={uploadLoading}
        />
      </div>
      <div className={styles["catalog-table-wrapper"]}>
        <div className={styles["catalog-table-header"]}>
          <div className={styles["catalog-table-column-first"]}>Images</div>
          <div className={styles["catalog-table-header-inner"]}>
            <div>Created</div>
            <div>Updated</div>
          </div>
          <div className={styles["catalog-table-column-last"]}></div>
        </div>

        <div className={styles["catalog-table-content"]}>
          {loading && (
            <div className={styles["catalog-loading-spinner"]}>
              <LoadingSpinner color="blue" />
            </div>
          )}

          {!loading && data?.data?.data?.length === 0 && (
            <p className={styles["catalog-table-no-content"]}>
              {MESSAGES.NO_RESULT_FOUND}
            </p>
          )}

          {!loading &&
            data?.data?.data?.length > 0 &&
            data.data.data.map((company) => (
              <CatalogItem
                key={company._id}
                company={company}
                onUpdate={handleReuploadBtnClick}
              />
            ))}
        </div>

        <div className={styles["catalog-table-footer"]}>
          <button
            onClick={handlePreviousBtnClick}
            disabled={pageNum === 0}
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
