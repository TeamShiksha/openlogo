import styles from './About.module.css';
import { INTEGRATIONS } from '../../utils/constants';
const About = () => { 
  return (
    <div className={styles.container}>
      <span className={styles.aboutUs}>About us</span>
      <h1 className={styles.title}>What is Openlogo</h1>
      <p className={styles.description}>
        From startups to enterprises, our platform offers an extensive collection of company logos, enabling smooth integration and consistent branding.
      </p>
      <p className={styles.subDescription}>
        Our APIs are designed to make logo retrieval effortless, providing scalable solutions that adapt to your business’s evolving branding requirements.
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