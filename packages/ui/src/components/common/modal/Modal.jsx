import PropTypes from "prop-types";
import styles from "./Modal.module.css";

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "medium",
  customWidth,
  customHeight,
  customClass,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (clickEvent) => {
    if (clickEvent.target === clickEvent.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const handleKeyBoardEvent = (keyboardEvent) => {
    if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
      handleOverlayClick(keyboardEvent);
    }
  };

  const getModalSize = () => {
    switch (size) {
      case "small":
        return styles.modalSmall;
      case "large":
        return styles.modalLarge;
      case "custom":
        return "";
      default:
        return styles.modalMedium;
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={handleOverlayClick}
      onKeyDown={(e) => handleKeyBoardEvent(e)}
    >
      <div
        className={`${styles.modal} ${getModalSize()} ${customClass || ""}`}
        style={{
          ...(customWidth ? { width: customWidth } : {}),
          ...(customHeight ? { height: customHeight } : {}),
        }}
      >
        {showCloseButton && (
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  size: PropTypes.oneOf(["small", "medium", "large", "custom"]),
  customWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customClass: PropTypes.string,
  customStyles: PropTypes.object,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
};

export default Modal;