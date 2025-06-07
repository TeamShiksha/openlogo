import styles from "./SettingCard.module.css";
import Button from "../common/button/Button";
import { SETTING } from "../../utils/Constants";
import PropTypes from "prop-types";
import { useState } from "react";
import DeleteAccountConfirmationModal from "./DeleteAccountConfirmationModal";

function SettingCard({ isGuest }) {
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState(false);

  const handleDeleteConfirmation = () => {
    setShowDeleteConfirmationModal(true);
  };

  const handleActionItem = (action) => {
    if (action === "delete") {
      handleDeleteConfirmation();
    } else {
      console.log("Action not recognized");
    }
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
      {showDeleteConfirmationModal && (
        <DeleteAccountConfirmationModal
          isOpen={showDeleteConfirmationModal}
          onClose={() => setShowDeleteConfirmationModal(false)}
        />
      )}
    </>
  );
}

SettingCard.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};
export default SettingCard;
