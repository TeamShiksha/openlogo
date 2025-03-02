import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import SignUpForm from "./Signup";
import SignInForm from "./Signin";
import styles from "./Auth.module.css";
import ModalStyles from "../common/modal/Modal.module.css";

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
      const handleClickOutside = (e) => {
        if (e.target === dialog) {
          onClose();
        }
      };
      dialog.addEventListener("click", handleClickOutside);
    } else if (!isOpen && dialog) {
      dialog.close();
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <dialog className={ModalStyles["modal-overlay"]} ref={dialogRef}>
      <div
        className={`${styles["modal-container"]} ${isFlipped ? styles.flipped : ""}`}
      >
        <div className={styles.front}>
          <SignUpForm toggleForm={toggleForm} onClose={onClose} />
        </div>
        <div className={styles.back}>
          <SignInForm toggleForm={toggleForm} onClose={onClose} />
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
