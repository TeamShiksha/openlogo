import Modal from "../common/modal/Modal.jsx";
import Button from "../common/button/Button.jsx";
import styles from "./Information.module.css";
import PropTypes from "prop-types";

function InformationModal({
  isOpen,
  onClose,
  heading,
  message,
  buttonText = "I Understand",
}) {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      customWidth="500px"
      closeOnOverlayClick={false}
      showCloseButton={true}
    >
      <div className={styles["information-content"]}>
        <h2 className={styles["information-heading"]}>{heading}</h2>
        <div className={styles["information-message"]}>{message}</div>
        <div className={styles["button-wrapper"]}>
          <Button variant="primary" onClick={onClose}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

InformationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  buttonText: PropTypes.string,
};

export default InformationModal;
