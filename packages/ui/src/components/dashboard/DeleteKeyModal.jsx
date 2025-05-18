import Modal from "../common/modal/Modal";
import styles from "./DeleteKeyModal.module.css";
import Button from "../common/button/Button";
import { useContext, useState } from "react";
import { useApi } from "../../hooks/useApi";
import PropTypes from "prop-types";
import { UserContext } from "../../contexts/Contexts.jsx";

const DeleteKeyModal = ({ selectedKey, isOpen, onClose }) => {
  const { fetchUserData } = useContext(UserContext);
  const [deleteError, setDeleteError] = useState("");

  const { makeRequest: deleteKeyRequest } = useApi({
    method: "delete",
    url: `/users/me/api-key/${selectedKey._id}`,
  });

  const handleDeleteConfirm = async () => {
    try {
      await deleteKeyRequest();
      fetchUserData();
      onClose();
    } catch (error) {
      setDeleteError("Failed to delete API key. Please try again.");
      console.error("Failed to delete API key:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        setDeleteError("");
      }}
      customWidth="400px"
    >
      <div className={styles["delete-modal"]}>
        <h2>Delete API Key</h2>
        <p>
          Are you sure you want to delete this API key? This action cannot be
          undone.
        </p>
        {deleteError && (
          <p className={styles["error-message"]}>{deleteError}</p>
        )}
        <div className={styles["modal-actions"]}>
          <Button
            variant="secondary"
            onClick={() => {
              onClose();
              setDeleteError("");
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

DeleteKeyModal.propTypes = {
  selectedKey: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteKeyModal;
