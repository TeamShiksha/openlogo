import Button from "../common/button/Button.jsx";
import Modal from "../common/modal/Modal.jsx";
import PropTypes from "prop-types";
import styles from "./DeleteAccountConfirmationModal.module.css";
import CustomInput from "../common/input/CustomInput.jsx";
import { useContext, useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { AuthContext, UserContext } from "../../contexts/Contexts.jsx";
import {
  DELETE_ACCOUNT_CONFIRMATION_MODAL,
  MESSAGES,
} from "../../utils/Constants.js";
import { useToast } from "../../hooks/useToast.js";

function DeleteAccountConfirmationModal({ isOpen, onClose }) {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { userData } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);

  const { makeRequest, errorMsg } = useApi({
    method: "DELETE",
    url: "/users/me",
    data: {
      userData,
    },
  });

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const success = await makeRequest();
      if (success) {
        setEmail("");
        onClose();
        toast.success(MESSAGES.ACCOUNT_DELETE_SUCCESS);
        setIsAuthenticated(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal data-testid="delete-account-modal" onClose={onClose} isOpen={isOpen}>
      <div>
        <div className={`"error-container" ${errorMsg ? "has-error" : ""}`}>
          <p data-testid="error-msg" className="input-error">
            {errorMsg}
          </p>
        </div>
        <div>
          <h2 className={styles["modal-title"]}>
            {DELETE_ACCOUNT_CONFIRMATION_MODAL.title}
          </h2>
          <p className={styles["modal-description"]}>
            {DELETE_ACCOUNT_CONFIRMATION_MODAL.subText}
          </p>
          <CustomInput
            type="email"
            name="email"
            label="Email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className={styles["modal-button-wrapper"]}>
          <Button type="button" variant="secondary" onClick={onClose}>
            {DELETE_ACCOUNT_CONFIRMATION_MODAL.secondaryButtonText}
          </Button>
          <Button
            type="button"
            variant="danger"
            isLoading={isDeleting}
            disabled={isDeleting || !email || userData.email !== email}
            onClick={handleDeleteAccount}
          >
            {DELETE_ACCOUNT_CONFIRMATION_MODAL.primaryButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

DeleteAccountConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteAccountConfirmationModal;
