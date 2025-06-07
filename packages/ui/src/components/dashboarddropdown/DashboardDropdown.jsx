import styles from "./DashboardDropdown.module.css";
import PropTypes from "prop-types";

function DashboardDropdown({role, setSelectedDashboard, selectedDashboard}) {

    const options = [];
  if (role === "ADMIN") {
    options.push("ADMIN", "OPERATOR", "USER");
  } else if (role === "OPERATOR") {
    options.push("OPERATOR", "USER");
  }

  return (
    <div className={styles["dropdown-div"]}>
      <select
        name="dashboard"
        id="dashboard"
        className={styles["dropdown"]}
        value={selectedDashboard}
        onChange={(e) => setSelectedDashboard(e.target.value)}
        data-testid="testid-dashboard-dropdown"
      >
        {options.map((option) => (
          <option key={option} className={styles["option"]} value={option}>
            {option.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

DashboardDropdown.propTypes = {
  role: PropTypes.string.isRequired,
  selectedDashboard: PropTypes.string.isRequired,
  setSelectedDashboard: PropTypes.func.isRequired,
};

export default DashboardDropdown;
