import Modal from "../common/modal/Modal";
import styles from "./DeleteKeyModal.module.css";
import Button from "../common/button/Button";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import PropTypes from "prop-types";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner";

const DeleteKeyModal = ({ selectedKey, isOpen, onClose }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const { makeRequest: deleteKeyRequest, errorMsg } = useApi({
    method: "delete",
    url: `/users/me/api-key/${selectedKey?._id}`,
  });

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg]);

  const handleDeleteConfirm = async () => {
    if (!selectedKey?._id) {
      toast.error("Invalid API key selected");
      return;
    }

    setIsDeleting(true);

    const success = await deleteKeyRequest();
    if (success) {
      toast.success("API key deleted successfully");
      onClose();
    }
    setIsDeleting(false);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} customWidth="400px">
      <div className={styles["delete-modal"]}>
        <h2>Delete API Key</h2>
        <p>
          Are you sure you want to delete the API key &quot;
          {selectedKey?.key_description}&quot; ? This action cannot be undone.
        </p>
        <div className={styles["modal-actions"]}>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <LoadingSpinner /> : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

DeleteKeyModal.propTypes = {
  selectedKey: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    key_description: PropTypes.string.isRequired,
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteKeyModal;
