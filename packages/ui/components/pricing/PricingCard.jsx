import React from "react";
import PropTypes from "prop-types";
import styles from "./PricingCard.module.css";
import tickIcon from "../../src/assets/Icon.svg";

function PricingCard({ name, pricing, tagline, index, keypoints }) {
  if (pricing === null) {
    return null;
  }

  const planPricing = pricing === 0 ? "Free" : `₹1500/mth`;

  return (
    <div
      className={`${styles.cardMainDiv} ${index === 1 ? styles.secondCard : ""}`}
    >
      {index === 1 && (
        <div className={styles.popularPlan}>Most popular plan</div>
      )}

      <div className={styles.cardSubDiv}>
        <h1 className={styles.planname}>{name}</h1>
        <div className={styles.planInfoContainer}>
          <h3 className={styles.planPricing}>{planPricing}</h3>
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

        <button
          className={styles.getStartedBtn}
          disabled={index === 1} // Disable button for most popular plan
        >
          {index === 1 ? "Coming Soon" : "Get Started"}
        </button>
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
