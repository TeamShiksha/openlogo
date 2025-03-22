import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext, UserContext } from "../contexts/Contexts";

function ProtectedRoute({ adminOnly = false, children }) {
  const location = useLocation();
  const { isAuthenticated, isGuest } = useContext(AuthContext);
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (
      adminOnly &&
      (isAuthenticated || isGuest) &&
      !loading &&
      !userData &&
      !hasFetched
    ) {
      setHasFetched(true);
      fetchUserData();
    }
  }, [
    adminOnly,
    loading,
    userData,
    hasFetched,
    fetchUserData,
    isAuthenticated,
    isGuest,
  ]);

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!adminOnly) {
    return children;
  }

  if (!loading && !userData) {
    alert("Something went wrong!");
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (userData.userType !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
