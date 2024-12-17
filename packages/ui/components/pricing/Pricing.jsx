import React from "react";
import styles from "./Pricing.module.css";
import PricingCard from "./PricingCard";
import plans from "../../utils/constants";

function Pricing() {
  // Filter out plans where pricing is null
  const filteredPlans = plans.filter((plan) => plan.pricing !== null);

  return (
    <div className={styles.mainDiv}>
      <div className={styles.submainDiv}>
        <h1 className={styles.heading}>Compare our plans and find yours</h1>
        <p className={styles.tagline}>
          Simple, transparent pricing that grows with you. Try any plan free for
          30 days.
        </p>
      </div>

      <div className={styles.cardsDiv}>
        {filteredPlans.map((plan, index) => (
          <PricingCard
            key={index}
            name={plan.name}
            pricing={plan.pricing}
            tagline={plan.tagline}
            index={plan.index}
            keypoints={plan.keypoints}
          />
        ))}
      </div>
    </div>
  );
}

export default Pricing;
