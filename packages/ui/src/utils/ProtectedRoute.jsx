import { useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext, UserContext } from "../contexts/Contexts";
import LoadingSpinner from "../components/common/loadingspinner/LoadingSpinner.jsx";
import { useToast } from "../hooks/useToast.js";

function ProtectedRoute({ adminOnly = false, children }) {
  const location = useLocation();
  const { isAuthenticated } = useContext(AuthContext);
  const { userData, loading, fetchUserData, error } = useContext(UserContext);
  const hasFetchedRef = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (
      adminOnly &&
      isAuthenticated &&
      !loading &&
      !userData &&
      !hasFetchedRef.current
    ) {
      hasFetchedRef.current = true;
      fetchUserData();
    }
  }, [adminOnly, isAuthenticated, userData, loading, fetchUserData]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (!adminOnly) {
    return children;
  }

  if (error) {
    console.error("Failed to fetch user data:", error);
    toast.error("Failed to fetch user data ! Try Again");
    return <Navigate to="/" replace />;
  }

  if (loading || !userData) {
    return <LoadingSpinner color="blue" />;
  }

  if (userData.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
