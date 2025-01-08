import React, { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import SignUpForm from "./signup";
import SignInForm from "./signin";
import styles from "./Auth.module.css";

const AuthModal = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const dialogRef = useRef(null);

  const toggleForm = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog) {
      dialog.showModal();

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleKeyDown);

      const handleClickOutside = (e) => {
        if (e.target === dialog) {
          onClose();
        }
      };

      dialog.addEventListener('click', handleClickOutside);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        dialog.removeEventListener('click', handleClickOutside);
      };
    } else if (!isOpen && dialog) {
      dialog.close();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (

      <dialog className={styles.modalOverlay} ref={dialogRef}>
        <div className={`${styles.modalContainer} ${isFlipped ? styles.flipped : ""}`}>
          <div className={styles.modalFront}>
            <SignUpForm toggleForm={toggleForm} />
            <hr className={styles.horizontalLine} />
            <button onClick={toggleForm} className={styles.toggleBtn}>
              Already have an account?
            </button>
            <button onClick={onClose} className={styles.closeButtonFront}>
              ×
            </button>
          </div>

          <div className={styles.modalBack}>
            <div className={styles.logoWrapperBack}>
              <img src="/logo-images.png" alt="Logo" className={styles.logo} />
            </div>
            <SignInForm />
            <hr className={styles.horizontalLine} />
            <button onClick={toggleForm} className={styles.toggleBtn}>
              Don't have an account?
            </button>
            <button onClick={onClose} className={styles.closeButtonBack}>
              ×
            </button>
          </div>
        </div>
      </dialog>
  
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;