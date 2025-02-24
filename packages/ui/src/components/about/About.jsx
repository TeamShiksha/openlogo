import { ABOUT } from "../../utils/Constants";
import styles from "./About.module.css";

const About = () => {
  return (
    <div data-testid="about" id="about" className={styles["about-container"]}>
      <h1 className={styles.title}>{ABOUT.TITLE}</h1>
      <p className={styles.description}>{ABOUT.DESCRIPTION}</p>
      <div className={styles["logo-grid"]}>
        {ABOUT["INTEGRATIONS"].map((integration) => (
          <div key={integration.id} className={styles["logo-item"]}>
            <img src={integration.src} alt={integration.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
