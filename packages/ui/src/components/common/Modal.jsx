import React from 'react';
import styles from './Modal.module.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  size = 'medium',
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

  const getModalSize = () => {
    switch (size) {
      case 'small':
        return styles.modalSmall;
      case 'large':
        return styles.modalLarge;
      case 'custom':
        return '';
      default:
        return styles.modalMedium;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div 
        className={`${styles.modal} ${getModalSize()} ${customClass || ''}`}
        style={{
          ...(customWidth?{width:customWidth}:{}),
          ...(customHeight?{height:customHeight}:{})
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

export default Modal;