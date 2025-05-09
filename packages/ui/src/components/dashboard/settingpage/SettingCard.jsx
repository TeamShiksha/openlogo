import styles from "./SettingCard.module.css";
import Button from "../../common/button/Button";
import { SETTING } from "../../../utils/Constants";
import PropTypes from "prop-types";

function SettingCard({ role }) {
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
            disabled={role == "GUEST"}
          >
            {setting.buttontitle}
          </Button>
        </div>
      ))}
    </>
  );
}

SettingCard.propTypes = {
  role: PropTypes.string.isRequired,
};
export default SettingCard;
