import PropTypes from "prop-types";
import { useState, useMemo, useCallback } from "react";
import { instance } from "../api/api_instance";
import { UserContext } from "./Contexts";
import { useToast } from "../hooks/useToast";

export function UserProvider({ children }) {
  const toast = useToast();
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await instance.get("user/me");
      const data = res.data.data;
      setUserData(data);
    } catch (err) {
      setError(err);
      toast.error(err);
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, toast]);

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
