import { RELEASE_PAGE } from "../../utils/Constants";
import styles from "./Release.module.css";
function About() {
  const { introduction } = RELEASE_PAGE;
  return (
    <div className={styles["about-section"]}>
      <h2>{introduction.heading}</h2>
      <p className={styles["description"]}>{introduction.description}</p>
      <ul>
        {introduction.features.map((feature, index) => (
          <li key={feature.desc + index}>
            <span className={styles["dot"]}></span>
            <div>
              <span className={styles["list-heading"]}>
                {feature.heading}:{" "}
              </span>
              <span className={styles["list-description"]}>{feature.desc}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default About;
