import Analytics from "../../components/analytics/Analytics";
import Catalog from "../catalog/Catalog.jsx";
import Dropdown from "../common/dropdown/Dropdown";
import styles from "./AdminDashboard.module.css";
import PropTypes from "prop-types";

function AdminDashboard({
  selectedDashboard,
  dashboardDropdownOptions,
  setSelectedDashboard,
}) {
  return (
    <div className={styles["admin-dashboard"]} data-testid="admin-dashboard">
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
            <Dropdown
              options={dashboardDropdownOptions}
              selectedOption={selectedDashboard}
              setSelectedOption={setSelectedDashboard}
              testId="admin-role-dropdown"
            />
          )}
        </div>
      </div>

      {/* Admin Dashboard Content */}
      <Analytics />
      <Catalog />
    </div>
  );
}

AdminDashboard.propTypes = {
  selectedDashboard: PropTypes.string.isRequired,
  dashboardDropdownOptions: PropTypes.array.isRequired,
  setSelectedDashboard: PropTypes.func.isRequired,
};

export default AdminDashboard;
