import PropTypes from "prop-types";
import tickIcon from "../../assets/Icon.svg";
import Button from "../common/button/Button";
import styles from "./PricingCard.module.css";

function PricingCard({ name, tagline, index, keypoints }) {
  const buttonText = index === 1 ? "Coming Soon" : "Get Started";
  const isDisabled = index === 1 ? true : false;

  return (
    <div className={styles.cardMainDiv}>
      <div className={styles.cardSubDiv}>
        <h1 className={styles.planname}>{name}</h1>
        <div className={styles.planInfoContainer}>
          <p className={styles.planTagline}>{tagline}</p>
        </div>
        <div className={styles.planKeypoints}>
          {keypoints.map((keypoint, idx) => (
            <div key={keypoint + idx}>
              <img alt="Tick Icon" src={tickIcon} className={styles.tickIcon} />
              <p>{keypoint}</p>
            </div>
          ))}
        </div>
        <Button
          variant={"primary"}
          className={styles.width}
          disabled={isDisabled}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

PricingCard.propTypes = {
  name: PropTypes.string.isRequired,
  pricing: PropTypes.number,
  index: PropTypes.number.isRequired,
  tagline: PropTypes.string.isRequired,
  keypoints: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PricingCard;
