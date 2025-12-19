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
  const [preSelectedFile, setPreSelectedFile] = useState(null);
  const [preFilledUri, setPreFilledUri] = useState("");

  const ITEMS_PER_PAGE = 6;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  const { data: searchData, makeRequest: searchMakeRequest } = useApi({
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
    } else {
      setShowWebCatalog(false);
      setShowWebResults(false);
    }
  }, [searchData]);
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

  // Fetch requests from API
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

  // Handle submitting a response
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

  // Load data when component mounts or when filters change
  useEffect(() => {
    if (searchType === "messages") {
      fetchMessages(currentPage);
    } else {
      fetchRequests(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchType, currentPage, activeTab]);

  // Validate response based on focus like in ContactForm
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

  // Check overall form validity
  useEffect(() => {
    const errors = validate({ message: responseText });
    setIsFormValid(Object.keys(errors).length === 0);
  }, [responseText]);

  // Helper function to filter items based on active tab
  const filterItemsByStatus = (items) => {
    return items.filter((item) => {
      if (activeTab === "active") {
        return ["PENDING"].includes(item.status);
      }
      return ["COMPLETED", "RESOLVED", "REJECTED"].includes(item.status);
    });
  };

  // Filter data based on active tab and search type
  const filteredData =
    searchType === "requests"
      ? filterItemsByStatus(requests)
      : filterItemsByStatus(messages);

  // Handle tab change (active vs archived)
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Pagination handlers
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
      const response = await fetch(img.url);
      const blob = await response.blob();
      const file = new File([blob], `${name}.png`, { type: "image/png" });

      setPreSelectedFile(file);
      setPreFilledUri(img.companyUri || "");

      setIsUploadModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch image:", error);
      toast.error("Failed to load image from web result.");
    }
  };

  const handleImageUpload = async ({ file, companyUri }) => {
    setUploadLoading(true);
    if (!file || !companyUri) return;
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
          label="Search Logo to Upload"
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
          }}
          onUpload={handleImageUpload}
          isLoading={uploadLoading}
          initialFile={preSelectedFile}
          initialCompanyUri={preFilledUri}
        />
      </div>
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
                ADD IMAGE MANUALLY
              </Button>
              <Button variant="secondary" onClick={handleSearchOnWeb}>
                Search on Web
              </Button>
            </div>
          </div>
        </div>
      )}
      {showWebResults &&
        searchData?.source === "web-search" &&
        searchData?.data?.length > 0 && (
          <div className={styles["catalog-search-modal"]}>
            <div className={styles["catalog-search-modal-header"]}>
              <div className={styles["catalog-search-modal-title"]}>
                Suggested Images from Web
              </div>
              <div
                className={styles["catalog-search-modal-cross"]}
                onClick={() => setShowWebResults(false)}
              >
                X
              </div>
            </div>

            {searchData?.data?.map((img, index) => (
              <div key={index} className={styles["search-modal-row"]}>
                <img
                  src={img.url}
                  alt={img.companyName}
                  width={40}
                  height={40}
                  className={styles["search-modal-img"]}
                />
                <div className={styles["search-modal-company-name"]}>
                  {img.companyName || "Unknown"}
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleWebResultUpload(img)}
                >
                  Upload
                </Button>
              </div>
            ))}
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
