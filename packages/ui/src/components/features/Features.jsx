import styles from "./Features.module.css";
import { featureItems } from "../../utils/constants";

function Features() {
  return (
    <section className={styles["features-container"]}>
      <div className={styles["features-container-head"]}>
        <h2>Features</h2>
        <p>
          OpenLogo provides fast API access to a vast, regularly updated logo
          library with search-driven insights for complete branding support.
        </p>
      </div>
      <div className={styles["features-container-body"]}>
        {featureItems.map((featureItem, index) => (
          <div className={styles["features-container-body-item"]} key={index}>
            <img src={featureItem.icon} alt="logo" />
            <h3>{featureItem.title}</h3>
            <p>{featureItem.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
