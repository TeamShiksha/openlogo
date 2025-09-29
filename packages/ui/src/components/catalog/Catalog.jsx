import { useEffect, useMemo, useState } from "react";
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

  const limit = 10;
  const skip = pageNum * limit;

  const { data, loading, makeRequest, errorMsg } = useApi({
    method: "GET",
    url: `/catalog/logos?skip=${skip}&limit=${limit}`,
  });

  const {
    loading: uploadLoading,
    makeRequest: uploadMakeRequest,
    errorMsg: uploadErrorMsg,
  } = useApi({
    method: updateImageId ? "PUT" : "POST",
    url: `/catalog/logoMetadata`,
    headers: { "Content-Type": "application/json" },
  });

  useEffect(() => {
    makeRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNum]);

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
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error(MESSAGES.IMAGE_UPLOAD_ERROR);
      }
    }
  };

  const handleUpdateImage = async ({ file }) => {
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
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
      } else {
        toast.error(MESSAGES.IMAGE_UPDATE_ERROR);
      }
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

  const handleReuploadBtnClick = (id, companyuri) => {
    setIsModalOpen(true);
    setUpdateImageId(id);
    setUpdatedImageCompanyUri(companyuri);
  };

  const filteredCompanies = useMemo(() => {
    const companies = data?.data?.data || [];
    return companies.filter((company) =>
      company.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className={styles["catalog-wrapper"]} data-testid="catalog">
      <div className={styles["catalog-search"]}>
        <CustomInput
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

          {!loading && filteredCompanies.length === 0 && (
            <p className={styles["catalog-table-no-content"]}>
              {MESSAGES.NO_RESULT_FOUND}
            </p>
          )}

          {!loading &&
            filteredCompanies.length > 0 &&
            filteredCompanies.map((company) => (
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
