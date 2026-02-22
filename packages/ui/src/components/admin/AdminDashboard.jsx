import Analytics from "../../components/analytics/Analytics";
import Catalog from "../catalog/Catalog.jsx";
import styles from "./AdminDashboard.module.css";
<<<<<<< HEAD
import PropTypes from "prop-types";
=======
>>>>>>> bf40cd7e (updated the ui of the admin dashboard)

function AdminDashboard({
  selectedDashboard,
  dashboardDropdownOptions,
  isDropdownOpen,
  setIsDropdownOpen,
  handleRoleSelect,
}) {
  return (
<<<<<<< HEAD
    <div>
      {/* Header for Admin Dashboard */}
      <div className={styles["page-header"]}>
        <div className={styles["title-section"]}>
          <h1 className={styles["dashboard-title"]}>Admin Dashboard</h1>
          <p className={styles["dashboard-subtitle"]}>
            Manage users, monitor system activity, and configure settings.
          </p>
        </div>

        <div className={styles["header-right"]}>
          {/* Role Dropdown */}
          {dashboardDropdownOptions && dashboardDropdownOptions.length > 0 && (
            <div className={styles["dropdown-wrapper"]}>
              <button
                className={styles["dropdown"]}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedDashboard}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {isDropdownOpen && (
                <div className={styles["dropdown-menu"]}>
                  {dashboardDropdownOptions.map((option) => (
                    <div
                      key={option}
                      className={styles["dropdown-item"]}
                      onClick={() => handleRoleSelect(option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Admin Dashboard Content */}
=======
    <div className={styles["admin-dashboard"]} data-testid="admin-dashboard">
      <div className={styles["dashboard-header"]}>
        <h2 className={styles["dashboard-title"]}>Admin Dashboard</h2>
      </div>
>>>>>>> bf40cd7e (updated the ui of the admin dashboard)
      <Analytics />
      <Catalog />
    </div>
  );
}

AdminDashboard.propTypes = {
  selectedDashboard: PropTypes.string.isRequired,
  dashboardDropdownOptions: PropTypes.array.isRequired,
  isDropdownOpen: PropTypes.bool.isRequired,
  setIsDropdownOpen: PropTypes.func.isRequired,
  handleRoleSelect: PropTypes.func.isRequired,
};

export default AdminDashboard;
