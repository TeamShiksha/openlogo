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
import DeleteKeyModal from "../../components/dashboard/DeleteKeyModal.jsx";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../hooks/useToast.js";

function Dashboard() {
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const toast = useToast();
  const { makeRequest: fetchUserKeys, data: userDataResponse } = useApi({
    method: "get",
    url: "/users/me",
  });

  const apiKeyTableData = useMemo(() => {
    return apiKeys.map(({ key_description, updated_at }) => [
      key_description,
      formatDate(updated_at),
    ]);
  }, [apiKeys]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (userData) {
      setIsGuest(userData?.role == "GUEST");
      setApiKeys(userData?.keys || []);
    }
  }, [userData]);

  useEffect(() => {
    if (userDataResponse?.data?.keys) {
      setApiKeys(userDataResponse.data.keys);
    }
  }, [userDataResponse]);

  const handleDeleteClick = (index) => {
    setSelectedKey(apiKeys[index]);
    setShowDeleteModal(true);
  };

  if (loading) {
    return <div>loading..</div>;
  }

  const handleLogout = () => {
    setIsLoading(true);
    logout();
    setIsLoading(false);
  };

  const handleKeyGenerated = async () => {
    const success = await fetchUserKeys();
    if (!success) {
      toast.error("Failed to fetch updated API keys");
    }
  };

  const handleDeleteModalClose = async () => {
    setShowDeleteModal(false);
    const success = await fetchUserKeys();
    if (!success) {
      toast.error("Failed to fetch updated API keys");
    }
  };

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
            <ApiKeyForm isGuest={isGuest} onKeyGenerated={handleKeyGenerated} />
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
          onDelete={handleDeleteClick}
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

      {showDeleteModal && (
        <DeleteKeyModal
          selectedKey={selectedKey}
          isOpen={showDeleteModal}
          onClose={handleDeleteModalClose}
        />
      )}
    </div>
  );
}

export default Dashboard;
