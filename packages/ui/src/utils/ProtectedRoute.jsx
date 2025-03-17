import PropTypes from "prop-types";
import { useContext, useEffect } from "react";
import { AuthContext, UserContext } from "../contexts/Contexts";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ adminOnly, children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    if (adminOnly && isAuthenticated && (loading || !userData)) {
      fetchUserData();
    }
  }, [adminOnly, fetchUserData, isAuthenticated, loading, userData]);

  if (adminOnly && isAuthenticated && (loading || !userData)) {
    console.log("spinner. needs to be implemented..");
  }

  if (adminOnly && isAuthenticated) {
    if (userData.userType === "ADMIN") {
      return children;
    } else {
      return <Navigate to="/" replace={true} />;
    }
  }

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }} />
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
