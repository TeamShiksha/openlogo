import PropTypes from "prop-types";
import styles from "./PricingCard.module.css";
import tickIcon from "../../src/assets/Icon.svg";

function PricingCard({ name, pricing, tagline, index, keypoints }) {
  let planPricing = `$${pricing}/mth`;
  return (
    <div
      className={`${styles.cardMainDiv} ${index == 1 ? styles.secondCard : ""}`}
    >
      {index == 1 && (
        <div className={styles.popularPlan}>Most popular plan</div>
      )}
      <div className={styles.cardSubDiv}>
        <h1 className={styles.planPrice}>{planPricing}</h1>
        <div>
          <h2 className={styles.planName}>{name}</h2>
          <p className={styles.planTagline}>{tagline}</p>
        </div>

        <div className={styles.planKeypoints}>
          {keypoints.map((keypoint, index) => (
            <div key={index}>
              <img alt="Tick Icon" src={tickIcon} className={styles.tickIcon} />
              <p>{keypoint}</p>
            </div>
          ))}
        </div>

        <button className={styles.getStartedBtn}>Get Started</button>
      </div>
    </div>
  );
}

PricingCard.propTypes = {
  name: PropTypes.string.isRequired,
  pricing: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  tagline: PropTypes.string.isRequired,
  keypoints: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PricingCard;
