import Modal from "../common/modal/Modal";
import styles from "./DeleteKeyModal.module.css";
import Button from "../common/button/Button";
import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import PropTypes from "prop-types";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner";
import { API_KEY, BUTTON_TEXT } from "../../utils/Constants";

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
      toast.error(API_KEY.delete.invalidKey);
      return;
    }

    setIsDeleting(true);

    const success = await deleteKeyRequest();
    if (success) {
      toast.success(API_KEY.delete.success);
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
        <h2>{API_KEY.delete.modal.title}</h2>
        <p className={styles["modal-description"]}>
          {API_KEY.delete.modal.description}
          <span className={styles["key-description"]}>
            {selectedKey?.key_description}
          </span>
        </p>
        <p>{API_KEY.delete.modal.warning}</p>
        <div className={styles["modal-actions"]}>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isDeleting}
          >
            {BUTTON_TEXT.cancel}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? <LoadingSpinner /> : BUTTON_TEXT.delete}
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
