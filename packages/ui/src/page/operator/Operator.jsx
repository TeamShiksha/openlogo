import { useState, useEffect } from "react";
import styles from "./Operator.module.css";
import Modal from "../../components/common/modal/Modal";
import OperatorCard from "../../components/operator/OperatorCard";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner";
import { instance } from "../../api/api_instance";
import { validate } from "../../utils/Helpers";
import Button from "../../components/common/button/Button";
import { useToast } from "../../hooks/useToast";

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
  const toast = useToast();

  // Data states
  const [messages, setMessages] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // Fetch messages from API
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
    const payload =
      responseAction === "respond"
        ? searchType === "messages"
          ? { reply: responseText }
          : { status: "RESOLVED", comment: responseText }
        : { status: "REJECTED", comment: responseText };

    setLoading(true);
    try {
      if (searchType === "messages") {
        await instance.put(`/messages/${currentItem._id}`, payload);
      } else {
        await instance.put(`/requests/${currentItem._id}`, payload);
      }

      // Refresh data after successful response
      if (searchType === "messages") {
        fetchMessages(currentPage);
      } else {
        fetchRequests(currentPage);
      }

      setIsModalOpen(false);
      setCurrentItem(null);
      setResponseText("");
      setFormErrors({});

      if (searchType === "messages") {
        if (responseAction === "respond") {
          toast.success("Responded to message successfully.");
        } else {
          toast.success("Message rejected successfully.");
        }
      } else {
        if (responseAction === "respond") {
          toast.success("Request marked as resolved successfully.");
        } else {
          toast.success("Request rejected successfully.");
        }
      }
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

  // Handle search type change (requests vs messages)
  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  };

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

  // Handle clicking respond button
  const handleRespondClick = (item, actionType = "respond") => {
    setCurrentItem(item);
    setResponseAction(actionType);
    setResponseText(item.comment || "");
    setFormErrors({}); // Clear form errors when opening a new modal
    setIsModalOpen(true);
  };

  // Handle response text change
  const handleResponseChange = (e) => {
    setResponseText(e.target.value);
  };

  return (
    <div className={`container ${styles["operator-container"]}`}>
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
        <select
          className={styles["type-selector"]}
          value={searchType}
          onChange={handleSearchTypeChange}
        >
          <option value="messages">Messages</option>
          <option value="requests">Requests</option>
        </select>
      </div>

      {loading ? (
        <div className={styles["loading-container"]}>
          <LoadingSpinner size={40} color="black" />
        </div>
      ) : filteredData.length === 0 ? (
        <div className={styles["empty-state"]}>
          No {searchType} found for this filter.
        </div>
      ) : (
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
      )}

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
        customWidth="500px"
        closeOnOverlayClick={!loading}
        showCloseButton={!loading}
        customClass={styles["response-modal"]}
      >
        <h2>
          {responseAction === "respond"
            ? searchType === "messages"
              ? "Respond to Message"
              : "Respond to Request"
            : searchType === "messages"
              ? "Reject Message"
              : "Reject Request"}
        </h2>

        <div className={styles["response-field"]}>
          <textarea
            id="response"
            name="message"
            value={responseText}
            onChange={handleResponseChange}
            rows={6}
            placeholder={
              responseAction === "respond"
                ? "Type your response here..."
                : "Please provide a reason for rejection..."
            }
            disabled={loading}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
          />
          <div
            className={`error-container ${formErrors.message ? "has-error" : ""}`}
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
          >
            {loading
              ? responseAction === "respond"
                ? "Sending Response..."
                : "Rejecting..."
              : responseAction === "respond"
                ? "Send Response"
                : "Confirm Rejection"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Operator;
