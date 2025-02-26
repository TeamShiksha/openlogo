import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { PropTypes } from "prop-types";
import AuthModal from "../../src/components/auth/Auth";
import { useContext } from "react";
import { AuthContext } from "../../src/contexts/Contexts";

const ModalWrapper = ({ children }) => {
  const { signupModal, setSignupModal } = useContext(AuthContext);

  return (
    <>
      {children}
      <AuthModal isOpen={signupModal} onClose={() => setSignupModal(false)} />
    </>
  );
};

export const TestWrapper = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalWrapper>{children}</ModalWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
};

TestWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

ModalWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
