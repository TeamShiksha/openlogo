import Modal from "../common/modal/Modal.jsx";
import Button from "../common/button/Button.jsx";
import styles from "./NotificationModal.module.css";
import PropTypes from "prop-types";

function NotificationModal({
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
      <div className={styles["notification-content"]}>
        <h2 className={styles["notification-heading"]}>{heading}</h2>
        <div className={styles["notification-message"]}>{message}</div>
        <Button variant="primary" onClick={onClose} style={{ width: "100%" }}>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}

NotificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  heading: PropTypes.string.isRequired,
  message: PropTypes.node.isRequired,
  buttonText: PropTypes.string,
};

export default NotificationModal;
