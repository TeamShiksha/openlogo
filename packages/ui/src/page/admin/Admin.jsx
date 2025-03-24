import Catalog from "../../components/admindashboard/Catalog";
import Analytics from "../../components/analytics/Analytics";
import styles from "./Admin.module.css";

function AdminDashboard() {
  return (
    <div className={`container ${styles["admin-page-container"]}`}>
      <Analytics />
      <Catalog />
    </div>
  );
}

export default AdminDashboard;
