import PropTypes from "prop-types";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { AuthContext } from "./Contexts";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const { makeRequest } = useApi({
    method: "post",
    url: `/auth/signout`,
  });

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
    const success = await makeRequest();
    if (success) setIsAuthenticated(false);
  }, [setIsAuthenticated, makeRequest]);

  const authValue = useMemo(
    () => ({
      isAuthenticated,
      setIsAuthenticated,
      logout,
    }),
    [isAuthenticated, setIsAuthenticated, logout]
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
