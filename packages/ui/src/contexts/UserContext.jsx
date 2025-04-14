import PropTypes from "prop-types";
import { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { instance } from "../api/api_instance";
import { AuthContext, UserContext } from "./Contexts";

export function UserProvider({ children }) {
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const { isAuthenticated } = useContext(AuthContext);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await instance.get("users/me");
      const data = res.data.data;
      setUserData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUserData(undefined);
    }
  }, [isAuthenticated, setUserData]);

  return (
    <UserContext.Provider
      value={useMemo(
        () => ({
          userData,
          loading,
          error,
          fetchUserData,
        }),
        [userData, loading, error, fetchUserData]
      )}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
