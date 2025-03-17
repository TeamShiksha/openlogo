import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../common/modal/Modal";
import SignUp from "./Signup";
import SignIn from "./Signin";

const AuthModal = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const toggleForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsFlipped(!isFlipped);
      setShowSignUp(!showSignUp);
      setIsTransitioning(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div style={{ opacity: isTransitioning ? 0 : 1, transition: 'opacity 0.3s' }}>
        {!showSignUp && <SignIn toggleForm={toggleForm} onClose={onClose} />}
        {showSignUp && <SignUp toggleForm={toggleForm} onClose={onClose} />}
      </div>
    </Modal>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
