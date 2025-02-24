import { features } from "../../utils/Constants";
import styles from "./Features.module.css";

function Features() {
  return (
    <section
      data-testid="features"
      id="features"
      className={styles["features-container"]}
    >
      <div className={styles.head}>
        <h2>{features.heading}</h2>
        <p>{features.summary}</p>
      </div>
      <div className={styles["features-list"]}>
        {features.items.map((featureItem, index) => (
          <div className={styles["features-list-item"]} key={index}>
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
