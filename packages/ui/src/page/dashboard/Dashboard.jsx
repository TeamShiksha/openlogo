import ApiKeyForm from "../../components/dashboard/apikeyform/ApiKeyForm";
import CurrentPlan from "../../components/dashboard/currentplan/CurrentPlan";
import Usage from "../../components/dashboard/usage/Usage";
import ChangePassword from "../../components/dashboard/changepassword/ChangePassword";
import UserInfo from "../../components/dashboard/userinfo/UserInfo";
import styles from "./Dashboard.module.css";
import CardWrapper from "../../components/dashboard/cardwrapper/CardWrapper.jsx";
import SettingCard from "../../components/dashboard/settingpage/SettingCard";

function Dashboard() {
  return (
    <div className={styles.dashboardContainer} data-testid="testid-dashboard">
      <div className={styles.dashboardContentContainer}>
        <section className={styles.dashboardContentSection}>
          <CardWrapper title="Usage">
            <Usage />
          </CardWrapper>
          <CardWrapper title="Generate New API Key">
            <ApiKeyForm />
          </CardWrapper>
          <CardWrapper
            title="Plan"
            status="Active"
            statusClass={styles.activeStatus}
          >
            <CurrentPlan />
          </CardWrapper>
        </section>
      </div>

      <div className={styles.dashboardContentContainer}>
        <section className={styles.dashboardContentSection}>
          <CardWrapper title="User Info">
            <UserInfo />
          </CardWrapper>
          <CardWrapper title="Change Password">
            <ChangePassword />
          </CardWrapper>
          <CardWrapper title="Setting">
            <SettingCard />
          </CardWrapper>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
