import { useEffect, useState, useRef } from "react";
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
import axios from "axios";
import { instance } from "../../api/api_instance.js";

function Catalog() {
  const toast = useToast();
  const [pageNum, setPageNum] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [updateImageId, setUpdateImageId] = useState(null);
  const [updatedImageCompanyUri, setUpdatedImageCompanyUri] = useState(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [uploadLoading, setUploadLoading] = useState(false);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  const pageBeforeSearchRef = useRef(0);
  const limit = 10;
  const skip = pageNum * limit;

  const { data, loading, makeRequest, errorMsg } = useApi({
    method: "GET",
    url: `/catalog/logos?skip=${skip}&limit=${limit}&search=${debouncedSearchTerm}`,
  });

  const { makeRequest: uploadMakeRequest, errorMsg: uploadErrorMsg } = useApi({
    method: updateImageId ? "PUT" : "POST",
    url: `/catalog/logoMetadata`,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    if (debouncedSearchTerm.length === 0 || debouncedSearchTerm.length >= 2) {
      makeRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum, debouncedSearchTerm]);

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
    setUploadLoading(true);
    if (!file || !companyUri) return;
    const extension = file.name.split(".").pop().toLowerCase();
    const size = file.size;

    try {
      const signedUrlResp = await instance.post("/catalog/signedUrl", {
        companyUri,
        extension,
        type: "upload",
      });
      if (!signedUrlResp) throw new Error("Failed to proceed your request");

      const { presignedUrl, key } = signedUrlResp.data?.data || {};
      if (!presignedUrl || !key) {
        throw new Error("Presigned url or key is missing");
      }
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const metadataSaved = await uploadMakeRequest({
        data: { companyUri, extension, size },
      });
      if (metadataSaved) {
        setIsModalOpen(false);
        setUpdateImageId(null);
        toast.success(MESSAGES.IMAGE_UPLOAD_SUCCESS);
        makeRequest();
        setUploadLoading(false);
      }
    } catch (err) {
      setUploadLoading(false);
      console.error("Upload error:", err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error(MESSAGES.IMAGE_UPLOAD_ERROR);
      }
    }
  };

  const handleUpdateImage = async ({ file }) => {
    setUploadLoading(true);
    if (!file || !updateImageId) return;

    const extension = file.name.split(".").pop().toLowerCase();
    const size = file.size;

    try {
      const signedUrlResp = await instance.post("/catalog/signedUrl", {
        companyUri: updatedImageCompanyUri,
        extension: extension,
        type: "update",
      });
      if (!signedUrlResp) throw new Error("Failed to proceed your request");
      const { presignedUrl, key } = signedUrlResp?.data?.data || {};

      if (!presignedUrl || !key) {
        throw new Error("Presigned url or key is missing");
      }

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const metadataSaved = await uploadMakeRequest({
        data: {
          companyUri: updatedImageCompanyUri,
          extension: extension,
          size: size,
          id: updateImageId,
        },
      });

      if (metadataSaved) {
        setIsModalOpen(false);
        setUpdateImageId(null);
        toast.success(MESSAGES.IMAGE_UPDATE_SUCCESS);
        makeRequest();
        setUploadLoading(false);
      }
    } catch (err) {
      setUploadLoading(false);
      console.error("Upload error:", err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error(MESSAGES.IMAGE_UPDATE_ERROR);
      }
    }
  };

  const handleSearchTermChange = (inputChangeEvent) => {
    const newSearchTerm = inputChangeEvent.target.value;
    const previousSearchTerm = searchTerm;
    setSearchTerm(newSearchTerm);

    if (newSearchTerm.length >= 2 && previousSearchTerm.length < 2) {
      pageBeforeSearchRef.current = pageNum;
      setPageNum(0);
    } else if (newSearchTerm.length >= 2 && previousSearchTerm.length >= 2) {
      setPageNum(0);
    } else if (newSearchTerm.length < 2 && previousSearchTerm.length >= 2) {
      // Reset to previous page before search
      setPageNum(pageBeforeSearchRef.current);
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

  const handleReuploadBtnClick = (id, companyuri) => {
    setIsModalOpen(true);
    setUpdateImageId(id);
    setUpdatedImageCompanyUri(companyuri);
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
