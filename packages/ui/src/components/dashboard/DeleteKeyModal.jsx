import Modal from "../common/modal/Modal";
import styles from "./DeleteKeyModal.module.css";
import Button from "../common/button/Button";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import PropTypes from "prop-types";
import { useToast } from "../../hooks/useToast";

const DeleteKeyModal = ({ selectedKey, isOpen, onClose }) => {
  const [deleteError, setDeleteError] = useState("");
  const toast = useToast();

  const { makeRequest: deleteKeyRequest } = useApi({
    method: "delete",
    url: `/users/me/api-key/${selectedKey._id}`,
  });

  const handleDeleteConfirm = async () => {
    try {
      await deleteKeyRequest();
      toast.success("API key deleted successfully");
      onClose();
    } catch (error) {
      setDeleteError("Failed to delete API key. Please try again.");
      toast.error("Failed to delete API key");
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
          Are you sure you want to delete the API key &quot;
          {selectedKey?.key_description}&quot; ? This action cannot be undone.
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
