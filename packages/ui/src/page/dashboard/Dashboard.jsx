import ApiKeyForm from "../../components/dashboard/ApiKeyForm/ApiKeyForm";
import CurrentPlan from "../../components/dashboard/CurrentPlan/CurrentPlan";
import Usage from "../../components/dashboard/Usage/Usage";
import styles from "./Dashboard.module.css";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer} data-testid="testid-dashboard">
      <div className={styles.dashboardContentContainer}>
        <section className={styles.dashboardContentSection}>
          <Usage />
          <div className={styles.generateApi}>
            <h1 className={styles.contentItemHeading}>Generate New API key</h1>
            <ApiKeyForm />
          </div>
          <CurrentPlan />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
