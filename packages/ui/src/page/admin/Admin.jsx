import Catalog from "../../components/admindashboard/Catalog";
import Analytics from "../../components/analytics/Analytics";

function AdminDashboard() {
  return (
    <div className="container">
      <Analytics />
      <Catalog />
    </div>
  );
}

export default AdminDashboard;
