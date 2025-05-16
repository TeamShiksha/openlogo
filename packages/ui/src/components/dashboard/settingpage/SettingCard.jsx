import styles from "./SettingCard.module.css";
import Button from "../../common/button/Button";
import { SETTING } from "../../../utils/Constants";
import PropTypes from "prop-types";

function SettingCard({ isGuest }) {
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
          >
            {setting.buttontitle}
          </Button>
        </div>
      ))}
    </>
  );
}

SettingCard.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};
export default SettingCard;
