import React, { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import styles from './AuthModal.module.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClose = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const toggleForm = () => {
    setIsFlipped(!isFlipped);
  };

  if (!isOpen) return null;

  return (
    <dialog className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContainer} ${isFlipped ? styles.flipped : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="auth-modal-title"
        aria-modal="true"
      >
 
        <div className={styles.modalFront}>
          <div className={styles.logoWrapperFront}>
            <img src="/openlogoname.svg" alt="Logo" className={styles.logo} />
          </div>

          <SignUpForm toggleForm={toggleForm} />

     
          <hr className={styles.horizontalLine} />

          <button onClick={toggleForm} className={styles.toggleBtn}>
            Already have an account?
          </button>

          <button onClick={handleClose} className={styles.closeButtonFront}>
            ×
          </button>
        </div>


        <div className={styles.modalBack}>
          <div className={styles.logoWrapperBack}>
            <img src="/openlogoname.svg" alt="Logo" className={styles.logo} />
          </div>

          <SignInForm />

 <hr className={styles.horizontalLine} />
          <button onClick={toggleForm} className={styles.toggleBtn}>
            Don't have an account?
          </button>

          <button onClick={handleClose} className={styles.closeButtonBack}>
            ×
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AuthModal;
