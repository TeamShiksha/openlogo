import styles from "./SettingCard.module.css";
import Button from "../../common/button/Button";
import { SETTING } from "../../../utils/Constants";

function SettingCard() {
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
          >
            {setting.buttontitle}
          </Button>
        </div>
      ))}
    </>
  );
}
export default SettingCard;
