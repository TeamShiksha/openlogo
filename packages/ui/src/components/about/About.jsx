import { INTEGRATIONS, ABOUT_TEXT } from "../../utils/Constants";
import styles from "./About.module.css";

const About = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>What is Openlogo</h1>
      <p className={styles.description}>{ABOUT_TEXT.DESCRIPTION}</p>
      <div className={styles.logoGrid}>
        {INTEGRATIONS.map((integration) => (
          <div key={integration.id} className={styles.logoItem}>
            <img src={integration.src} alt={integration.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
