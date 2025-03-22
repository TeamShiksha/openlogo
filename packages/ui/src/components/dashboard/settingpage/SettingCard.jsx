import styles from "./SettingCard.module.css";
import Button from "../../common/button/Button";
import { SETTING } from "../../../utils/Constants";
import { guestTokenPresent } from "../../../utils/Helpers";

function SettingCard() {
  const guestToken = guestTokenPresent();
  return (
    <>
      {SETTING.map((setting, index) => (
        <div key={index} className={styles.actionButtonWrapper}>
          <p className={styles.actionText}>{setting.subtitle}</p>
          <Button
            type="submit"
            variant={
              setting.buttontitle.toLowerCase().includes("delete")
                ? "danger"
                : "primary"
            }
            className={styles.actionButton}
            disabled={!!guestToken}
          >
            {setting.buttontitle}
          </Button>
        </div>
      ))}
    </>
  );
}
export default SettingCard;
