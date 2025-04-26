import { useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../contexts/Contexts.jsx";
import ApiKeyForm from "../../components/dashboard/apikeyform/ApiKeyForm";
import CurrentPlan from "../../components/dashboard/currentplan/CurrentPlan";
import Usage from "../../components/dashboard/usage/Usage";
import ChangePassword from "../../components/dashboard/changepassword/ChangePassword";
import UserInfo from "../../components/dashboard/userinfo/UserInfo";
import styles from "./Dashboard.module.css";
import CardWrapper from "../../components/dashboard/cardwrapper/CardWrapper.jsx";
import SettingCard from "../../components/dashboard/settingpage/SettingCard";
import Table from "../../components/common/table/Table.jsx";
import { formatDate } from "../../utils/Helpers.js";

const TABLE_HEADER_DATA = ["Description", "Created", "Action"];
const EMPTY_MESSAGE =
  "Your api keys will be visible here, click on generate key to add new api key";

function Dashboard() {
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const apiKeyTableData = useMemo(() => {
    let data = [];
    if (userData) {
      data = userData.keys.map(({ key_description, updated_at }) => [
        key_description,
        formatDate(updated_at),
      ]);
    }
    return data;
  }, [userData]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return <div>loading..</div>;
  }

  return (
    <div
      className={styles["dashboard-container"]}
      data-testid="testid-dashboard"
    >
      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <CardWrapper title="Usage">
            <Usage
              usageCount={userData?.subscription.usage_count || 0}
              usageLimit={userData?.subscription.usage_limit || 0}
            />
          </CardWrapper>
          <CardWrapper title="Generate New API Key">
            <ApiKeyForm />
          </CardWrapper>
          <CardWrapper
            title="Plan"
            status="Active"
            statusClass={styles["active-status"]}
          >
            <CurrentPlan />
          </CardWrapper>
        </section>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={TABLE_HEADER_DATA}
          rows={apiKeyTableData}
          emptyMessage={EMPTY_MESSAGE}
          onDelete={() => {}}
        />
      </div>

      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <CardWrapper title="User Info">
            <UserInfo
              name={userData?.name || ""}
              email={userData?.email || ""}
            />
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
