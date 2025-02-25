import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { instance } from "../api/api_instance";
import { AuthContext } from "./Contexts";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [signupModal, setSignupModal] = useState(false); // Add this line

  useEffect(() => {
    const checkCookieExists = () => {
      const jwtCookie = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("jwt="));
      setIsAuthenticated(jwtCookie);
      setIsAuthCheckComplete(true);
    };

    checkCookieExists();
  }, []);

  const logout = useCallback(async () => {
    try {
      await instance.get(`api/auth/signout`);
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err);
    }
  }, [setIsAuthenticated]);

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          isAuthenticated,
          setIsAuthenticated,
          logout,
          signupModal,
          setSignupModal,
        }),
        [isAuthenticated, setIsAuthenticated, logout, signupModal]
      )}
    >
      {isAuthCheckComplete ? children : null}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
