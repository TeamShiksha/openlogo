import styles from "./PrivacyPolicy.module.css";
import { PRIVACY_POLICY_CONTENT } from "../../utils/Constants";

const PrivacyPolicy = () => {
  return (
    <div className={`container ${styles["privacy-page-container"]}`}>
      {PRIVACY_POLICY_CONTENT.map((POLICY_ITEMS, _i) => {
        return (
          <div key={_i}>
            <h2 className={styles.heading}>{POLICY_ITEMS.HEADLINE}</h2>
            {POLICY_ITEMS.TEXTS.map((TEXT_ITEMS, _j) => {
              return (
                <p className={styles.text} key={_j}>
                  {TEXT_ITEMS}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default PrivacyPolicy;
