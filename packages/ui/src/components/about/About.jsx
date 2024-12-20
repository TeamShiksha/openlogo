import styles from './About.module.css';
import { INTEGRATIONS, ABOUT_TEXT } from '../../utils/constants';
const About = () => { 
  return (
    <div className={styles.container}>
      <span className={styles.aboutUs}>About us</span>
      <h1 className={styles.title}>What is Openlogo</h1>
      <p className={styles.description}>
        {ABOUT_TEXT.DESCRIPTION}
      </p>
      <p className={styles.subDescription}>
        {ABOUT_TEXT.SUB_DESCRIPTION}
      </p>
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