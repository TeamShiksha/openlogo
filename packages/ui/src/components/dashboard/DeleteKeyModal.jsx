import Modal from "../common/modal/Modal";
import styles from "./DeleteKeyModal.module.css";
import Button from "../common/button/Button";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useApi } from "../../hooks/useApi";
import PropTypes from "prop-types";
const DeleteKeyModal = ({ selectedKey }) => {
  const { fetchUserData } = useContext(UserContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { makeRequest: deleteKeyRequest } = useApi({
    method: "delete",
    url: `/users/api-key/${selectedKey.keyId}`,
  });
  const handleDeleteConfirm = async () => {
    try {
      await deleteKeyRequest();
      await fetchUserData();
      setShowDeleteModal(false);
    } catch (error) {
      setDeleteError("Failed to delete API key. Please try again.");
      console.error("Failed to delete API key:", error);
    }
  };
  return (
    <div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
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
                setShowDeleteModal(false);
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
    </div>
  );
};

DeleteKeyModal.propTypes = {
  selectedKey: PropTypes.object.isRequired,
};

export default DeleteKeyModal;
