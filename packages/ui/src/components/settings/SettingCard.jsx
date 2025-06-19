import styles from "./SettingCard.module.css";
import Button from "../common/button/Button";
import {
  DELETE_ACCOUNT,
  EMAIL_DOES_NOT_EXIST,
  MESSAGES,
  SETTING,
} from "../../utils/Constants";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import { useContext, useEffect, useState } from "react";
import { AuthContext, UserContext } from "../../contexts/Contexts";
import ConfirmationModal from "../confirm/ConfirmationModal";
import { useToast } from "../../hooks/useToast";
import { useApi } from "../../hooks/useApi";
import LoadingSpinner from "../common/loadingspinner/LoadingSpinner";

function SettingCard({ isGuest }) {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [email, setEmail] = useState("");
  const { userData } = useContext(UserContext);
  const { setIsAuthenticated } = useContext(AuthContext);
  const toast = useToast();

  const { makeRequest, errorMsg } = useApi({
    method: "DELETE",
    url: "/users/me",
    data: {
      userData,
    },
  });

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  const handleDeleteConfirmation = () => {
    setShowConfirmationModal(true);
  };

  const handleDeleteAccount = async () => {
    if (email !== userData?.email) {
      toast.error(EMAIL_DOES_NOT_EXIST.MESSAGE);
      return;
    }
    setIsDeleting(true);
    try {
      const success = await makeRequest();
      if (success) {
        setEmail("");
        setShowConfirmationModal(false);
        toast.success(MESSAGES.ACCOUNT_DELETE_SUCCESS);
        setIsAuthenticated(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };
  const handleActionItem = (action) => {
    if (action === "delete") {
      handleDeleteConfirmation();
    }
  };

  const handleCloseModal = () => {
    setShowConfirmationModal(false);
    setEmail("");
  };

  return (
    <>
      {SETTING.map((setting, index) => (
        <div key={index} className={styles["action-button-wrapper"]}>
          <p className={styles["action-text"]}>{setting.subtitle}</p>
          <Button
            type="submit"
            variant={
              setting.buttontitle.toLowerCase().includes("delete")
                ? "danger"
                : "primary"
            }
            className={styles["action-button"]}
            disabled={isGuest}
            onClick={() => handleActionItem(setting.action)}
          >
            {setting.buttontitle}
          </Button>
        </div>
      ))}
      {showConfirmationModal && (
        <div data-testid="confirmation-modal">
          <ConfirmationModal
            isOpen={showConfirmationModal}
            onClose={handleCloseModal}
            onConfirm={handleDeleteAccount}
            isConfirmDisabled={!email || userData.email !== email || isDeleting}
            isConfirmLoading={isDeleting}
            confirmButtonContent={
              isDeleting ? <LoadingSpinner /> : DELETE_ACCOUNT.primaryButtonText
            }
            customHeading={DELETE_ACCOUNT.title}
            customDescription={DELETE_ACCOUNT.subText}
            headingClassName={styles["delete-account-modal-title"]}
            descriptionClassName={styles["delete-account-modal-description"]}
          >
            <CustomInput
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </ConfirmationModal>
        </div>
      )}
    </>
  );
}

SettingCard.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default SettingCard;
