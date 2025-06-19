import Modal from "../common/modal/Modal.jsx";
import Button from "../common/button/Button.jsx";
import styles from "./ConfirmationModal.module.css";
import PropTypes from "prop-types";
import { CONFIRMATION_MODAL } from "../../utils/Constants.js";

function ConfirmationModal({
  isOpen,
  onClose,
  children,
  onConfirm,
  isConfirmDisabled = false,
  confirmButtonContent,
  customHeading,
  customDescription,
  headingClassName = "",
  descriptionClassName = "",
}) {
  return (
    <Modal data-testid="confirmation-modal" onClose={onClose} isOpen={isOpen}>
      <div>
        <h2
          className={`${styles["confirm-modal-heading"]}, ${headingClassName}`}
        >
          {customHeading || CONFIRMATION_MODAL.heading}
        </h2>
        <div
          className={`${styles["confirm-modal-description"]} ${descriptionClassName}`}
        >
          {customDescription || CONFIRMATION_MODAL.description}
        </div>
      </div>
      <div>{children}</div>
      <div className={styles["confirm-modal-button-wrapper"]}>
        <Button type="button" variant="secondary" onClick={onClose}>
          {CONFIRMATION_MODAL.secondaryButtonText}
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          disabled={isConfirmDisabled}
        >
          {confirmButtonContent || CONFIRMATION_MODAL.primaryButtonText}
        </Button>
      </div>
    </Modal>
  );
}

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  onConfirm: PropTypes.func.isRequired,
  isConfirmDisabled: PropTypes.bool,
  isConfirmLoading: PropTypes.bool,
  confirmButtonContent: PropTypes.node,
  customHeading: PropTypes.node,
  customDescription: PropTypes.node,

  headingClassName: PropTypes.string,
  descriptionClassName: PropTypes.string,
};

export default ConfirmationModal;
