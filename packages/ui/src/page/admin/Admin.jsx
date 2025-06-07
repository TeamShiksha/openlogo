import Catalog from "../../components/admindashboard/Catalog";
import Analytics from "../../components/analytics/Analytics";
import styles from "./Admin.module.css";

function AdminDashboard() {
  return (
      //no need to add 'container class' along with styles in classname as it has been included inside parent div in Dashboard.jsx
    <div className={styles["admin-page-container"]} data-testid="testid-admin-dashboard"> 
      <Analytics />
      <Catalog />
    </div>
  );
}

export default AdminDashboard;
