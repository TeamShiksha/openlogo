import { useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "../../contexts/Contexts.jsx";
import ApiKeyForm from "../../components/apikeyform/ApiKeyForm";
import CurrentPlan from "../../components/currentplan/CurrentPlan";
import Usage from "../../components/usage/Usage";
import ChangePassword from "../../components/changepassword/ChangePassword";
import UserInfo from "../../components/userinfo/UserInfo";
import styles from "./Dashboard.module.css";
import CardWrapper from "../../components/cardwrapper/CardWrapper.jsx";
import SettingCard from "../../components/settings/SettingCard";
import Table from "../../components/common/table/Table.jsx";
import { formatDate } from "../../utils/Helpers.js";
import { API_KEY, API_KEY_TABLE, BUTTON_TEXT } from "../../utils/Constants.js";
import Dropdown from "../../components/common/dropdown/Dropdown.jsx";
import ConfirmationModal from "../../components/confirm/ConfirmationModal.jsx";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../hooks/useToast.js";
import LoadingSpinner from "../../components/common/loadingspinner/LoadingSpinner.jsx";
import AdminDashboard from "../../components/admin/AdminDashboard.jsx";
import CustomInput from "../../components/common/input/CustomInput.jsx";
import OperatorDashboard from "../../components/operator/OperatorDashboard.jsx";
import InformationModal from "../../components/Information/Information.jsx";
function Dashboard() {
  const { userData, loading, fetchUserData } = useContext(UserContext);
  const [confirmKeyName, setConfirmKeyName] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState("USER");
  const [isGuest, setIsGuest] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const toast = useToast();
  const { makeRequest: fetchUserKeys, data: userDataResponse } = useApi({
    method: "get",
    url: "/user/me",
  });
  const { makeRequest: deleteKeyRequest, errorMsg } = useApi({
    method: "delete",
    url: `/user/api-key/${selectedKey?._id}`,
  });
  const { fetchRequest: updateOldKeysRequest } = useApi({
    method: "GET",
    url: "/user/update-oldKeys",
    withCredentials: true,
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

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
    }
  }, [errorMsg, toast]);

  const handleDeleteClick = (index) => {
    setSelectedKey(apiKeys[index]);
    setConfirmKeyName("");
    setShowModal(true);
  };

  useEffect(() => {
    async function checkOldKeys() {
      const result = await updateOldKeysRequest();

      if (!result.success && result.error) {
        toast.error(result.error);
        return;
      }

      if (result.success && result.data?.keysUpdated === true) {
        setShowLoader(true);
        setTimeout(() => {
          setShowLoader(false);
          setShowUpdateModal(true);
        }, 2000);
      }
    }

    checkOldKeys();
  }, []);

  const handleKeyNameChange = (e) => {
    setConfirmKeyName(e.target.value);
  };

  const handleDeleteKey = async () => {
    if (!selectedKey?._id) {
      toast.error(API_KEY.delete.invalidKey);
      return;
    }
    setIsDeleting(true);
    const success = await deleteKeyRequest();
    if (success) {
      toast.success(API_KEY.delete.success);
      setShowModal(false);
      await fetchUserKeys();
    }
    setIsDeleting(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setConfirmKeyName("");
  };

  if (loading) {
    return (
      <div
        data-testid="loading-spinner"
        className={styles["spinner-container"]}
      >
        <LoadingSpinner size={40} border={4} color={`gray`} />
      </div>
    );
  }

  const handleKeyGenerated = async () => {
    const success = await fetchUserKeys();
    if (!success) {
      toast.error("Failed to fetch updated API keys");
    }
  };

  const dashboardDropdownOptions = [];
  if (userData?.role === "ADMIN") {
    dashboardDropdownOptions.push("ADMIN", "OPERATOR", "USER");
  } else if (userData?.role === "OPERATOR") {
    dashboardDropdownOptions.push("OPERATOR", "USER");
  }

  return (
    <div
      className={`container ${styles["dashboard-container"]}`}
      data-testid="testid-dashboard"
    >
      {showLoader && (
        <div className={styles["overlay-loader"]}>
          <div className={styles["loader-content"]}>
            <LoadingSpinner size={60} border={6} />
            <p className={styles["loader-text"]}>
              Updating your old API keys...
            </p>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <InformationModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          heading="Notification"
          buttonText="I Understand"
          closeOnOverlayClick={false}
          message={
            <>
              <p>Our application has undergone some improvements.</p>
              <p style={{ marginTop: "10px" }}>
                You had older API keys we have updated their expiry dates for
                you.
              </p>
            </>
          }
        />
      )}

      <div>
        {(userData?.role === "ADMIN" || userData?.role === "OPERATOR") && (
          <Dropdown
            options={dashboardDropdownOptions}
            selectedOption={selectedDashboard}
            setSelectedOption={setSelectedDashboard}
          />
        )}
      </div>

      {selectedDashboard === "ADMIN" ? (
        <div data-testid="testid-admin-dashboard">
          <AdminDashboard />
        </div>
      ) : selectedDashboard === "OPERATOR" ? (
        <div data-testid="testid-operator-dashboard">
          <OperatorDashboard />
        </div>
      ) : (
        <>
          <div className={styles["dashboard-content-container"]}>
            <section className={styles["dashboard-content-section"]}>
              <CardWrapper title="Usage">
                <Usage
                  usageCount={userData?.subscription.usage_count || 0}
                  usageLimit={userData?.subscription.usage_limit || 0}
                />
              </CardWrapper>
              <CardWrapper title="Generate New API Key">
                <ApiKeyForm
                  isGuest={isGuest}
                  onKeyGenerated={handleKeyGenerated}
                />
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
              onDelete={handleDeleteClick}
              isGuest={isGuest}
              emptyMessage={API_KEY_TABLE.emptyMessage}
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
        </>
      )}
      {showModal && (
        <div data-testid="delete-api-key-modal">
          <ConfirmationModal
            isOpen={showModal}
            onClose={handleModalClose}
            onConfirm={handleDeleteKey}
            isConfirmDisabled={confirmKeyName !== selectedKey?.key_description}
            isConfirmLoading={isDeleting}
            confirmButtonContent={BUTTON_TEXT.delete}
            customHeading={API_KEY.delete.modal.title}
            customDescription={
              <div>
                {API_KEY.delete.modal.description}{" "}
                <strong className={styles["deletekey-name"]}>
                  {selectedKey.key_description}
                </strong>
                ? {API_KEY.delete.modal.warning}
              </div>
            }
          >
            <CustomInput
              data-testid="api-key-confirm-input"
              type="text"
              name="apiKeyName"
              label="API Key Name"
              value={confirmKeyName}
              onChange={handleKeyNameChange}
            />
          </ConfirmationModal>
        </div>
      )}
    </div>
  );
}
export default Dashboard;
