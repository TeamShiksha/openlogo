import Catalog from "../../components/admindashboard/Catalog";
import Analytics from "../../components/analytics/Analytics";
import styles from "./Admin.module.css";

function AdminDashboard() {
  return (
    <div className={styles["admin-page-container"]} data-testid="testid-admin-dashboard"> 
      <Analytics />
      <Catalog />
    </div>
  );
}

export default AdminDashboard;
