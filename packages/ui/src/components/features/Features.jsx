import { featureItems } from "../../utils/constants";
import styles from "./Features.module.css";

function Features() {
  return (
    <section className={styles["features-container"]}>
      <div className={styles["features-container-head"]}>
        <h2>Features</h2>
        <p>
          With Openlogo, integrate fresh, up-to-date company logos effortlessly
          and leverage smart search insights for professional branding.
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
