import PropTypes from "prop-types";
import styles from "./DashboardDropdown.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DashboardDropdown({ role }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.substring(1);

  const [currentDashboard, setCurrentDashboard] = useState(currentPath);
  useEffect(() => {
    setCurrentDashboard(
      currentDashboard === "dashboard" ? "USER" : currentDashboard
    );
  }, [currentDashboard]);

  const navigateDashboard = (route) => {
    if (route == "USER") {
      navigate("/dashboard");
    } else {
      navigate(`/${route.toLowerCase()}`);
    }
  };

  const options = [];
  if (role == "ADMIN") {
    options.push("ADMIN", "OPERATOR", "USER");
  } else if (role == "OPERATOR") {
    options.push("OPERATOR", "USER");
  }

  return (
    <div className={styles["dropdown-div"]}>
      <select
        name="dashboard"
        id="dashboard"
        className={styles["dropdown"]}
        value={currentDashboard}
        onChange={(e) => navigateDashboard(e.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

DashboardDropdown.propTypes = {
  role: PropTypes.string.isRequired,
};
export default DashboardDropdown;
