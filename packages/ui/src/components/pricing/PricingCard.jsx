import PropTypes from "prop-types";
import tickIcon from "../../assets/Icon.svg";
import Button from "../common/button/Button";
import { BUTTON_TEXT } from "../../utils/Constants";
import styles from "./PricingCard.module.css";

function PricingCard({
  name,
  tagline,
  index,
  pricing,
  keypoints,
  activePlan,
  openAuthModal,
}) {
  const isPro = index === 1;
  const isPlanActive = activePlan === name;

  let buttonText = BUTTON_TEXT.getStarted;
  if (isPlanActive) {
    buttonText = BUTTON_TEXT.active;
  } else if (isPro) {
    buttonText = "Upgrade to Pro";
  }

  const isDisabled = isPlanActive;

  return (
    <div className={`${styles.card} ${isPro ? styles.dark : styles.light}`}>
      <p className={styles["plan-name"]}>{name}</p>

      <div className={styles["price-row"]}>
        <span className={styles.price}>
          {pricing === 0 ? "Free" : `$${pricing}`}
        </span>
        <span className={styles["price-period"]}>
          {pricing === 0 ? "forever" : tagline.replace(`$${pricing} `, "")}
        </span>
      </div>

      <ul className={styles.keypoints}>
        {keypoints.map((keypoint, idx) => (
          <li key={keypoint + idx}>
            <img
              alt="Tick Icon"
              src={tickIcon}
              className={styles["tick-icon"]}
            />
            <p>{keypoint}</p>
          </li>
        ))}
      </ul>

      <Button
        variant={isPro ? "primary" : "secondary"}
        className={styles["btn-full"]}
        disabled={isDisabled}
        onClick={openAuthModal}
      >
        {buttonText}
      </Button>
    </div>
  );
}

PricingCard.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  tagline: PropTypes.string.isRequired,
  pricing: PropTypes.number.isRequired,
  keypoints: PropTypes.arrayOf(PropTypes.string).isRequired,
  activePlan: PropTypes.string,
  openAuthModal: PropTypes.func.isRequired,
};

export default PricingCard;
