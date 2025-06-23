import PropTypes from "prop-types";
import { BUTTON_TEXT } from "../../../utils/Constants";
import styles from "./Modal.module.css";
import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  children,
  customWidth,
  customHeight,
  customClass,
  showCloseButton = true,
  closeOnOverlayClick = true,
}) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (clickEvent) => {
    if (clickEvent.target === clickEvent.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div
      data-testid="modal-overlay"
      className={styles["modal-overlay"]}
      onClick={handleOverlayClick}
    >
      <div
        role="dialog"
        className={`${styles.modal} ${customClass || ""}`}
        style={{
          ...(customWidth ? { width: customWidth } : {}),
          ...(customHeight ? { height: customHeight } : {}),
        }}
      >
        {showCloseButton && (
          <button className={styles["close-button"]} onClick={onClose}>
            {BUTTON_TEXT.cross}
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
  customWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customClass: PropTypes.string,
  customStyles: PropTypes.object,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
};

export default Modal;
