import { useState } from "react";
import styles from "./Operator.module.css";
import Modal from "../../components/common/modal/Modal";
import OperatorCard from "../../components/operator/OperatorCard";

const Operator = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [searchType, setSearchType] = useState("requests");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [responseText, setResponseText] = useState("");

  const ITEMS_PER_PAGE = 6;

  const logoRequestsData = [
    {
      _id: "65f3b1c2d3e4f5a6b7c8d9e0",
      user_id: {
        _id: "65e3c4d5e6f7a8b9c0d1e2f3",
        name: "Company A",
        email: "contact@companya.com",
      },
      companyUrl: "https://www.companya.com",
      status: "PENDING",
      operator: null,
      comment: null,
      updated_at: "2025-03-20T11:25:33Z",
      created_at: "2025-03-20T11:25:33Z",
    },
    {
      _id: "65f3b2c3d4e5f6a7b8c9d0e1",
      user_id: {
        _id: "65e3c5d6e7f8a9b0c1d2e3f4",
        name: "Company B",
        email: "info@companyb.com",
      },
      companyUrl: "https://companyb.com",
      status: "IN_PROGRESS",
      operator: {
        _id: "65e1a2b3c4d5e6f7a8b9c0d1",
        name: "Operator Jane",
      },
      comment: "Working on logo update",
      updated_at: "2025-03-15T14:30:20Z",
      created_at: "2025-03-15T09:45:12Z",
    },
    {
      _id: "65f3b3c4d5e6f7a8b9c0d1e2",
      user_id: {
        _id: "65e3c6d7e8f9a0b1c2d3e4f5",
        name: "Company C",
        email: "support@companyc.org",
      },
      companyUrl: "https://www.companyc.org",
      status: "RESOLVED",
      operator: {
        _id: "65e2b3c4d5e6f7a8b9c0d1e2",
        name: "Operator Alex",
      },
      comment: "Logo redesign completed",
      updated_at: "2025-03-10T16:20:45Z",
      created_at: "2025-03-10T13:10:05Z",
    },
    {
      _id: "65f3b4c5d6e7f8a9b0c1d2e3",
      user_id: {
        _id: "65e3c7d8e9f0a1b2c3d4e5f6",
        name: "Company D",
        email: "hello@companyd.net",
      },
      companyUrl: "https://companyd.net",
      status: "PENDING",
      operator: null,
      comment: null,
      updated_at: "2025-04-05T09:30:12Z",
      created_at: "2025-04-05T09:30:12Z",
    },
    {
      _id: "65f3b5c6d7e8f9a0b1c2d3e4",
      user_id: {
        _id: "65e3c8d9e0f1a2b3c4d5e6f7",
        name: "Company E",
        email: "info@companye.io",
      },
      companyUrl: "https://companye.io",
      status: "REJECTED",
      operator: {
        _id: "65e1a2b3c4d5e6f7a8b9c0d1",
        name: "Operator Jane",
      },
      comment: "Request not eligible",
      updated_at: "2025-04-02T14:45:30Z",
      created_at: "2025-04-01T11:20:15Z",
    },
    {
      _id: "65f3b6c7d8e9f0a1b2c3d4e5",
      user_id: {
        _id: "65e3c9d0e1f2a3b4c5d6e7f8",
        name: "Company F",
        email: "support@companyf.com",
      },
      companyUrl: "https://www.companyf.com",
      status: "PENDING",
      operator: null,
      comment: null,
      updated_at: "2025-04-10T16:15:45Z",
      created_at: "2025-04-10T16:15:45Z",
    },
  ];

  const messagesData = [
    {
      _id: "65f2a1b3c4d5e6f7a8b9c0d1",
      email: "user1@example.com",
      name: "User 1",
      message:
        "I need support with my account. I'm having trouble accessing my premium features after upgrading my subscription.",
      status: "PENDING",
      operator: null,
      created_at: "2025-03-22T14:30:45Z",
      is_deleted: false,
      updated_at: "2025-03-22T14:30:45Z",
      comment: null,
    },
    {
      _id: "65f2a2c3d4e5f6a7b8c9d0e1",
      email: "user2@example.com",
      name: "User 2",
      message:
        "I have a question about your services. Do you offer custom logo design services for enterprise clients?",
      status: "IN_PROGRESS",
      operator: "65e1a2b3c4d5e6f7a8b9c0d1",
      created_at: "2025-03-18T09:15:30Z",
      is_deleted: false,
      updated_at: "2025-03-18T12:45:22Z",
      comment: "Contacted customer to address inquiry",
    },
    {
      _id: "65f2a3d4e5f6a7b8c9d0e1f2",
      email: "user3@example.com",
      name: "User 3",
      message:
        "Thank you for the excellent service! The logo you designed perfectly captures our brand identity.",
      status: "RESOLVED",
      operator: "65e1a2b3c4d5e6f7a8b9c0d1",
      created_at: "2025-03-12T16:20:10Z",
      is_deleted: false,
      updated_at: "2025-03-14T11:05:33Z",
      comment: "Thanked customer for feedback",
    },
    {
      _id: "65f2a4e5f6a7b8c9d0e1f2a3",
      email: "user4@example.com",
      name: "User 4",
      message:
        "I'm experiencing an issue with downloading my logo files. The download link seems to be broken.",
      status: "PENDING",
      operator: null,
      created_at: "2025-04-08T10:45:30Z",
      is_deleted: false,
      updated_at: "2025-04-08T10:45:30Z",
      comment: null,
    },
    {
      _id: "65f2a5f6a7b8c9d0e1f2a3b4",
      email: "user5@example.com",
      name: "User 5",
      message:
        "I'd like to request a refund for my recent purchase. The service didn't meet my expectations.",
      status: "IN_PROGRESS",
      operator: "65e2b3c4d5e6f7a8b9c0d1e2",
      created_at: "2025-04-05T08:30:15Z",
      is_deleted: false,
      updated_at: "2025-04-05T09:20:45Z",
      comment: "Investigating refund request",
    },
    {
      _id: "65f2a6a7b8c9d0e1f2a3b4c5",
      email: "user6@example.com",
      name: "User 6",
      message:
        "How do I modify the colors in my purchased logo template? I need to adjust them to match my brand guidelines.",
      status: "PENDING",
      operator: null,
      created_at: "2025-04-12T11:25:40Z",
      is_deleted: false,
      updated_at: "2025-04-12T11:25:40Z",
      comment: null,
    },
  ];

  const filteredData =
    searchType === "requests"
      ? logoRequestsData.filter((item) =>
          activeTab === "active"
            ? ["PENDING", "IN_PROGRESS"].includes(item.status)
            : ["RESOLVED", "REJECTED"].includes(item.status)
        )
      : messagesData.filter((item) =>
          activeTab === "active"
            ? ["PENDING", "IN_PROGRESS"].includes(item.status)
            : ["RESOLVED", "REJECTED"].includes(item.status)
        );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  };

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

  const handleRespondClick = (item) => {
    setCurrentItem(item);
    setResponseText(item.comment || "");
    setIsModalOpen(true);
  };

  const handleResponseSubmit = () => {
    console.log("Sending response:", {
      itemId: currentItem._id,
      response: responseText,
      itemType: searchType === "messages" ? "message" : "request",
    });

    setIsModalOpen(false);
    setCurrentItem(null);
    setResponseText("");
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

      <div className={styles["cards-container"]}>
        {currentItems.map((item) => (
          <OperatorCard
            key={item._id}
            item={item}
            searchType={searchType}
            onRespondClick={handleRespondClick}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles["page-button"]}
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
          >
            &laquo;
          </button>

          <button
            className={styles["page-button"]}
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
          >
            &raquo;
          </button>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customWidth="500px"
        closeOnOverlayClick={true}
        showCloseButton={true}
        customClass={styles["response-modal"]}
      >
        <h2>Respond to customer</h2>

        <div className={styles["response-field"]}>
          <textarea
            id="response"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            rows={6}
            placeholder="Type your response here..."
          />
        </div>

        <div className={styles["modal-actions"]}>
          <button
            className={styles["send-button"]}
            onClick={handleResponseSubmit}
            disabled={!responseText.trim()}
          >
            Send
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Operator;
