import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { instance } from "../api/api_instance";
import { AuthContext } from "./Contexts";
import { guestTokenPresent } from "../utils/Helpers";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const checkCookieExists = () => {
      const jwtCookie = document.cookie
        .split(";")
        .some((item) => item.trim().startsWith("jwt="));
      const guestCookie = guestTokenPresent();
      setIsAuthenticated(jwtCookie);
      setIsGuest(guestCookie);
      setIsAuthCheckComplete(true);
    };

    checkCookieExists();
  }, []);

  const logout = useCallback(async () => {
    try {
      await instance.get(`api/auth/signout`);
      setIsAuthenticated(false);
      setIsGuest(false);
    } catch (err) {
      console.error(err);
    }
  }, [setIsAuthenticated]);

  const authValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      isGuest,
      setIsGuest,
      logout,
    }),
    [isAuthenticated, setIsAuthenticated, isGuest, setIsGuest, logout]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {isAuthCheckComplete ? children : null}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
