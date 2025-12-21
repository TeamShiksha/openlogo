import { useState, useEffect } from "react";
import styles from "./OperatorDashboard.module.css";
import Modal from "../common/modal/Modal";
import OperatorCard from "../operatorcard/OperatorCard";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner";
import { instance } from "../../api/api_instance";
import { validate } from "../../utils/Helpers";
import Button from "../common/button/Button";
import { useToast } from "../../hooks/useToast";
import { BUTTON_TEXT, MESSAGES, MODAL_MESSAGES } from "../../utils/Constants";
import Dropdown from "../common/dropdown/Dropdown";
import ImageUploadModal from "../catalog/ImageUploadModal";
import CustomInput from "../common/input/CustomInput";
import { useApi } from "../../hooks/useApi";
import axios from "axios";

const createPayload = (searchType, responseText, responseAction) => {
  const status = responseAction === "respond" ? "RESOLVED" : "REJECTED";
  if (searchType === "messages") {
    return { reply: responseText, status };
  } else {
    return { comment: responseText, status };
  }
};

const showSuccessToast = (toast, searchType, responseAction) => {
  if (searchType === "messages") {
    if (responseAction === "respond") {
      toast.success("Responded to message successfully.");
    } else {
      toast.success("Message rejected successfully.");
    }
  } else if (responseAction === "respond") {
    toast.success("Request marked as resolved successfully.");
  } else {
    toast.success("Request rejected successfully.");
  }
};

const Operator = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchType, setSearchType] = useState("messages");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [responseAction, setResponseAction] = useState("respond");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const toast = useToast();
  const OperatorDashboardDropdownOptions = ["messages", "requests"];

  // Data states
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [showWebCatalog, setShowWebCatalog] = useState(false);
  const [showWebResults, setShowWebResults] = useState(false);
  const [showDbResults, setShowDbResults] = useState(false);
  const [preSelectedFile, setPreSelectedFile] = useState(null);
  const [preFilledUri, setPreFilledUri] = useState("");
  const [updateImageId, setUpdateImageId] = useState(null);
  const [updatedImageCompanyUri, setUpdatedImageCompanyUri] = useState(null);

  const ITEMS_PER_PAGE = 6;

  // Debounce logic for search
  useEffect(() => {
    if (searchTerm.length < 2) {
      setDebouncedSearchTerm("");
      setShowWebCatalog(false);
      setShowWebResults(false);
      setShowDbResults(false);
      return;
    }
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const {
    data: searchData,
    makeRequest: searchMakeRequest,
    loading: searchLoading,
  } = useApi({
    method: "GET",
    url: `/catalog/logos?skip=0&limit=10&search=${debouncedSearchTerm}`,
  });
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      searchMakeRequest();
    }
  }, [debouncedSearchTerm]);
  useEffect(() => {
    if (searchData?.source === "web-search") {
      setShowWebCatalog(true);
      setShowWebResults(false);
      setShowDbResults(false);
    } else if (searchData?.source === "db-search") {
      setShowWebCatalog(false);
      setShowWebResults(false);
      setShowDbResults(true);
    }
  }, [searchData, debouncedSearchTerm]);

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const response = await instance.get("/messages", {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          tab: activeTab,
        },
      });
      setMessages(response.data.results);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async (page = 1) => {
    setLoading(true);
    try {
      const response = await instance.get("/requests", {
        params: {
          page,
          limit: ITEMS_PER_PAGE,
          tab: activeTab,
        },
      });
      setRequests(response.data.results);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponseSubmit = async () => {
    if (!currentItem) return;
    const payload = createPayload(searchType, responseText, responseAction);

    setLoading(true);
    try {
      const isMessages = searchType === "messages";
      const endpoint = isMessages
        ? `/messages/${currentItem._id}`
        : `/requests/${currentItem._id}`;
      const refreshData = isMessages ? fetchMessages : fetchRequests;

      await instance.put(endpoint, payload);
      refreshData(currentPage);

      setIsModalOpen(false);
      setCurrentItem(null);
      setResponseText("");
      setFormErrors({});

      showSuccessToast(toast, searchType, responseAction);
    } catch (err) {
      console.error("Error sending response:", err);
      setFormErrors({ message: "Error sending response" });
      toast.error("Failed to send response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch initial data based on tab/type
  useEffect(() => {
    if (searchType === "messages") {
      fetchMessages(currentPage);
    } else {
      fetchRequests(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType, currentPage, activeTab]);

  useEffect(() => {
    if (!focusedField) {
      if (responseText) {
        const errors = validate({ message: responseText });
        setFormErrors(errors);
      } else {
        setFormErrors({});
      }
      return;
    }

    const timeout = setTimeout(() => {
      const validationErrors = validate({
        [focusedField]: responseText,
      });
      setFormErrors(validationErrors);
    }, 500);

    return () => clearTimeout(timeout);
  }, [focusedField, responseText]);

  useEffect(() => {
    const errors = validate({ message: responseText });
    setIsFormValid(Object.keys(errors).length === 0);
  }, [responseText]);

  const filterItemsByStatus = (items) => {
    return items.filter((item) => {
      if (activeTab === "active") {
        return ["PENDING"].includes(item.status);
      }
      return ["COMPLETED", "RESOLVED", "REJECTED"].includes(item.status);
    });
  };

  const filteredData =
    searchType === "requests"
      ? filterItemsByStatus(requests)
      : filterItemsByStatus(messages);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleRespondClick = (item, actionType = "respond") => {
    setCurrentItem(item);
    setResponseAction(actionType);
    setResponseText(item.comment || "");
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  const { makeRequest: uploadMakeRequest, errorMsg: uploadErrorMsg } = useApi({
    method: "POST",
    url: `/catalog/logo`,
    headers: { "Content-Type": "application/json" },
  });

  const { fetchRequest: getPresignedURLRequest, errorMsg: fetchErrMsg } =
    useApi({
      method: "POST",
      url: `/catalog/signed-url`,
    });

  useEffect(() => {
    if (uploadErrorMsg) {
      toast.error(uploadErrorMsg);
    }
  }, [uploadErrorMsg, toast]);

  useEffect(() => {
    if (fetchErrMsg) {
      toast.error(fetchErrMsg);
    }
  }, [fetchErrMsg, toast]);

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchOnWeb = () => {
    setShowWebCatalog(false);
    setShowWebResults(true);
  };

  const handleWebResultUpload = async (img) => {
    try {
      const name = img.companyName ? img.companyName.toLowerCase() : "image";
      const logoUrl = img.url;

      const response = await fetch(logoUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch logo: ${response.status}`);
      }

      const blob = await response.blob();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img_element = new Image();
      img_element.crossOrigin = "anonymous";

      img_element.onload = () => {
        canvas.width = img_element.width;
        canvas.height = img_element.height;
        ctx.drawImage(img_element, 0, 0);

        canvas.toBlob((pngBlob) => {
          const pngFile = new File([pngBlob], `${name}.png`, {
            type: "image/png",
          });

          console.debug("Image converted to PNG:", {
            companyUri: img.companyUri,
            logoUrl: logoUrl,
            companyName: img.companyName,
            fileName: pngFile.name,
            fileType: pngFile.type,
          });
          setUpdateImageId(null);
          setUpdatedImageCompanyUri(null);
          setPreSelectedFile(pngFile);
          setPreFilledUri(img.companyUri || "");
          setIsUploadModalOpen(true);
        }, "image/png");
      };

      img_element.onerror = () => {
        const pngFile = new File([blob], `${name}.png`, {
          type: "image/png",
        });

        setUpdateImageId(null);
        setUpdatedImageCompanyUri(null);
        setPreSelectedFile(pngFile);
        setPreFilledUri(img.companyUri || "");
        setIsUploadModalOpen(true);
      };
      img_element.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to fetch logo from web search:", error);
      toast.error("Failed to load logo. Please try again.");
    }
  };

  const handleImageUpload = async ({ file, companyUri }) => {
    if (!file || !companyUri) {
      toast.error(MESSAGES.UPLOAD_VALID_IMAGE);
      return;
    }
    setUploadLoading(true);
    const extension = file.name.split(".").pop().toLowerCase();
    const size = file.size;

    try {
      const { success, data: uploadResp } = await getPresignedURLRequest({
        data: {
          companyUri,
          extension,
          type: "upload",
        },
      });
      if (!success || !uploadResp) {
        toast.error("Failed to proceed your request");
      }
      const { data } = uploadResp;
      const { presignedUrl, key } = data;

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
        setIsUploadModalOpen(false);
        setPreSelectedFile(null);
        setPreFilledUri("");
        toast.success(MESSAGES.IMAGE_UPLOAD_SUCCESS);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(MESSAGES.IMAGE_UPLOAD_ERROR);
    } finally {
      setUploadLoading(false);
    }
  };
  const handleUpdateImage = async ({ file }) => {
    if (!file || !updateImageId) {
      toast.error(MESSAGES.IMAGE_UPDATE_ERROR);
      return;
    }
    setUploadLoading(true);

    const extension = file.name.split(".").pop().toLowerCase();
    const size = file.size;

    try {
      const { success, data: uploadResp } = await getPresignedURLRequest({
        data: {
          companyUri: updatedImageCompanyUri,
          extension: extension,
          type: "update",
        },
      });
      if (!success || !uploadResp) {
        throw new Error("Failed to proceed your request");
      }
      const { data } = uploadResp;
      const { presignedUrl, key } = data;

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
        setIsUploadModalOpen(false);
        setUpdateImageId(null);
        setPreSelectedFile(null);
        setPreFilledUri("");
        toast.success(MESSAGES.IMAGE_UPDATE_SUCCESS);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(MESSAGES.IMAGE_UPDATE_ERROR);
    } finally {
      setUploadLoading(false);
    }
  };

  let modalTitle;
  if (responseAction === "respond") {
    if (searchType === "messages") {
      modalTitle = "Respond to Message";
    } else {
      modalTitle = "Respond to Request";
    }
  } else if (searchType === "messages") {
    modalTitle = "Reject Message";
  } else {
    modalTitle = "Reject Request";
  }

  let submitButtonText;
  if (responseAction === "respond") {
    submitButtonText = BUTTON_TEXT.sendResponse;
  } else {
    submitButtonText = BUTTON_TEXT.confirmRejection;
  }

  let contentToRender;
  if (loading) {
    contentToRender = (
      <div className={styles["loading-container"]}>
        <LoadingSpinner size={40} color="black" />
      </div>
    );
  } else if (filteredData.length === 0) {
    contentToRender = (
      <div className={styles["empty-state"]}>
        No {searchType} found for this filter.
      </div>
    );
  } else {
    contentToRender = (
      <div className={styles["cards-container"]}>
        {filteredData.map((item) => (
          <OperatorCard
            key={item._id}
            item={item}
            searchType={searchType}
            onRespondClick={handleRespondClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles["operator-container"]}>
      <div className={styles["catalog-search"]}>
        <CustomInput
          name="search"
          type="search"
          label="Search"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <Button
          onClick={() => {
            setPreSelectedFile(null);
            setPreFilledUri("");
            setIsUploadModalOpen(true);
          }}
          variant="primary"
          className={styles["catalog-add-image-btn"]}
        >
          Add image
        </Button>
        <ImageUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => {
            setIsUploadModalOpen(false);
            setPreSelectedFile(null);
            setPreFilledUri("");
            setUpdateImageId(null);
            setUpdatedImageCompanyUri(null);
          }}
          onUpload={updateImageId ? handleUpdateImage : handleImageUpload}
          isUpdate={!!updateImageId}
          isLoading={uploadLoading}
          initialFile={preSelectedFile}
          initialCompanyUri={preFilledUri}
        />
      </div>
      {searchLoading && (
        <div
          className={styles["loading-container"]}
          style={{ marginTop: "20px" }}
        >
          <LoadingSpinner size={20} color="rgba(45, 8, 193, 1)" />
        </div>
      )}
      {showWebCatalog && searchData?.source === "web-search" && (
        <div className={styles["catalog-search-modal"]}>
          <div className={styles["catalog-search-modal-header"]}>
            <div className={styles["catalog-search-modal-title"]}>
              Image Not Found in DB
            </div>
            <div
              className={styles["catalog-search-modal-cross"]}
              onClick={() => setShowWebCatalog(false)}
            >
              ✕
            </div>
          </div>
          <div className={styles["web-search-catalog-body"]}>
            <p>We couldn’t find this image in our catalog database.</p>
            <div className={styles["web-search-actions"]}>
              <Button
                variant="primary"
                onClick={() => {
                  setPreSelectedFile(null);
                  setPreFilledUri("");
                  setIsUploadModalOpen(true);
                }}
              >
                ADD IMAGE
              </Button>
              <Button variant="secondary" onClick={handleSearchOnWeb}>
                Search on Web
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* WEB SEARCH RESULTS DISPLAY - Updated: Extension removed */}
      {showWebResults &&
        searchData?.source === "web-search" &&
        searchData?.data?.length > 0 && (
          <div className={styles["catalog-table-wrapper"]}>
            <div className={styles["catalog-table-header"]}>
              <div className={styles["catalog-table-column-first"]}>Image</div>
              <div className={styles["catalog-table-column-last"]}></div>
            </div>

            <div className={styles["operator-catalog-list"]}>
              {searchData.data.map((img, index) => (
                <div key={index} className={styles["operator-catalog-row"]}>
                  <div className={styles["operator-catalog-left"]}>
                    <div className={styles["catalog-item-img"]}>
                      <img src={img.url} alt={img.companyName || "image"} />
                    </div>
                    {/* Only show company name, no extension here */}
                    <div className={styles["operator-catalog-name"]}>
                      {(img.companyName || "unknown").toLowerCase()}
                    </div>
                  </div>
                  <div className={styles["operator-catalog-actions"]}>
                    <Button
                      onClick={() => handleWebResultUpload(img)}
                      variant="primary"
                      className={styles["reupload-btn"]}
                    >
                      Upload
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {showDbResults &&
        searchData?.source === "db-search" &&
        searchData?.data?.data?.length > 0 && (
          <div className={styles["catalog-table-wrapper"]}>
            <div className={styles["catalog-table-header"]}>
              <div className={styles["catalog-table-column-first"]}>Images</div>
              <div className={styles["catalog-table-column-last"]}></div>
            </div>

            <div className={styles["operator-catalog-list"]}>
              {searchData.data.data.map((company) => (
                <div
                  key={company._id}
                  className={styles["operator-catalog-row"]}
                >
                  <div className={styles["operator-catalog-left"]}>
                    <div className={styles["catalog-item-img"]}>
                      <div className={styles["catalog-item-initials"]}>
                        {company.company_name
                          ? company.company_name[0].toUpperCase()
                          : "#"}
                      </div>
                    </div>
                    <div className={styles["operator-catalog-name"]}>
                      {company.company_name.toLowerCase()}.{company.extension}
                    </div>
                  </div>
                  <div className={styles["operator-catalog-actions"]}>
                    <Button
                      onClick={() => {
                        setPreSelectedFile(null);
                        setPreFilledUri(company.company_uri || "");
                        setUpdateImageId(company._id);
                        setUpdatedImageCompanyUri(company.company_uri || "");
                        setIsUploadModalOpen(true);
                      }}
                      variant="primary"
                      className={styles["reupload-btn"]}
                    >
                      Reupload
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      <div className={styles.header}>
        <div className={styles["tabs-container"]}>
          <button
            className={`${styles["tab-button"]} ${activeTab === "active" ? styles["active-tab"] : ""}`}
            onClick={() => handleTabChange("active")}
          >
            Active
          </button>
          <button
            className={`${styles["tab-button"]} ${activeTab === "archived" ? styles["active-tab"] : ""}`}
            onClick={() => handleTabChange("archived")}
          >
            Archived
          </button>
        </div>
        <Dropdown
          options={OperatorDashboardDropdownOptions}
          selectedOption={searchType}
          setSelectedOption={setSearchType}
          className={styles["type-selector"]}
        />
      </div>

      {contentToRender}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles["page-button"]}
            disabled={currentPage === 1 || loading}
            onClick={goToPreviousPage}
          >
            &laquo;
          </button>
          <span className={styles["page-indicator"]}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className={styles["page-button"]}
            disabled={currentPage === totalPages || loading}
            onClick={goToNextPage}
          >
            &raquo;
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormErrors({});
        }}
        customWidth="350px"
        closeOnOverlayClick={!loading}
        showCloseButton={!loading}
        customClass={styles["response-modal"]}
      >
        <h2>{modalTitle}</h2>

        <div className={styles["response-field"]}>
          <textarea
            id="response"
            name="message"
            value={responseText}
            onChange={handleResponseChange}
            rows={2}
            placeholder={
              responseAction === "respond"
                ? MODAL_MESSAGES.RESPOND
                : MODAL_MESSAGES.REJECT
            }
            disabled={loading}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
          />
          <div className={styles["character-limit"]}>
            <p>
              {`[${responseText.length}/` +
                MODAL_MESSAGES.CHARACTER_LIMIT +
                `]`}
            </p>
          </div>
          <div
            className={`${styles["error-container"]} ${formErrors.message ? "has-error" : ""}`}
          >
            <p className="input-error">{formErrors.message}</p>
          </div>
        </div>

        <div className={styles["modal-actions"]}>
          <Button
            onClick={handleResponseSubmit}
            disabled={!isFormValid || loading}
            variant={responseAction === "respond" ? "primary" : "danger"}
            className={styles["send-button"]}
            isLoading={loading}
          >
            {submitButtonText}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Operator;
