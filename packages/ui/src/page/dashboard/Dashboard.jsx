import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext, UserContext } from "../../contexts/Contexts.jsx";
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
import { API_KEY_TABLE, BUTTON_TEXT } from "../../utils/Constants.js";
import Button from "../../components/common/button/Button.jsx";
import DashboardDropdown from "../../components/dashboarddropdown/dashboardDropDown.jsx";

function Dashboard() {
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    if (userData) {
      setIsGuest(userData?.role == "GUEST");
    }
  }, [userData]);

  if (loading) {
    return <div>loading..</div>;
  }

  const handleLogout = () => {
    setIsLoading(true);
    logout();
    setIsLoading(false);
  };

  return (
    <div
      className={styles["dashboard-container"]}
      data-testid="testid-dashboard"
    >
      <div>
        {userData?.role !== "CUSTOMER" || userData?.role !== "GUEST" ? (
          <DashboardDropdown role={userData?.role} />
        ) : (
          <></>
        )}
      </div>
      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <CardWrapper title="Usage">
            <Usage
              usageCount={userData?.subscription.usage_count || 0}
              usageLimit={userData?.subscription.usage_limit || 0}
            />
          </CardWrapper>
          <CardWrapper title="Generate New API Key">
            <ApiKeyForm isGuest={isGuest} />
          </CardWrapper>
          <CardWrapper
            title="Plan"
            status="Active"
            statusClass={styles["active-status"]}
          >
            <CurrentPlan isGuest={isGuest} />
          </CardWrapper>
        </section>
      </div>
      <div className={styles["table-wrapper"]}>
        <Table
          headers={API_KEY_TABLE.headers}
          rows={apiKeyTableData}
          emptyMessage={API_KEY_TABLE.emptyMessage}
          onDelete={() => {}}
          isGuest={isGuest}
        />
      </div>

      <div className={styles["dashboard-content-container"]}>
        <section className={styles["dashboard-content-section"]}>
          <CardWrapper title="User Info">
            <UserInfo
              name={userData?.name || ""}
              email={userData?.email || ""}
              isGuest={isGuest}
            />
          </CardWrapper>
          <CardWrapper title="Change Password">
            <ChangePassword isGuest={isGuest} />
          </CardWrapper>
          <CardWrapper title="Setting">
            <SettingCard isGuest={isGuest} />
          </CardWrapper>
        </section>
      </div>

      <div className={styles["logout-wrapper"]}>
        {isAuthenticated ? (
          <Button
            variant="danger"
            className={styles["logout-btn"]}
            onClick={handleLogout}
            isLoading={isLoading}
          >
            {BUTTON_TEXT.signOut}
          </Button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Dashboard;
