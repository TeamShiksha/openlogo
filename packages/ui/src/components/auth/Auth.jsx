import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "../common/modal/Modal";
import SignUp from "./Signup";
import SignIn from "./Signin";

const AuthModal = ({ isOpen, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const toggleForm = () => {
    setIsFlipped(!isFlipped);
  };

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      {!isFlipped && <SignIn toggleForm={toggleForm} onClose={onClose} />}
      {isFlipped && <SignUp toggleForm={toggleForm} onClose={onClose} />}
    </Modal>
  );
};

AuthModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AuthModal;
