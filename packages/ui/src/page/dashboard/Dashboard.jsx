import ApiKeyForm from "../../components/dashboard/apikeyform/ApiKeyForm";
import CurrentPlan from "../../components/dashboard/currentplan/CurrentPlan";
import Usage from "../../components/dashboard/usage/Usage";
import ChangePassword from "../../components/dashboard/changepassword/ChangePassword";
import styles from "./Dashboard.module.css";
import UserInfo from "../../components/dashboard/userinfo/UserInfo";
import SettingCard from "../../components/dashboard/settingpage/SettingCard";

function Dashboard() {
  return (
    <div
      className={styles["dashboard-container"]}
      data-testid="testid-dashboard"
    >
      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <Usage />
          <div className={styles["generate-api"]}>
            <h1 className={styles["content-item-heading"]}>
              Generate New API key
            </h1>
            <ApiKeyForm />
          </div>
          <CurrentPlan />
        </section>
      </div>
      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <UserInfo />
          <ChangePassword />
          <SettingCard />
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
