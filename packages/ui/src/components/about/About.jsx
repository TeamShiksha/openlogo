import styles from './About.module.css';
import { INTEGRATIONS } from '../../utils/constants';
const About = () => { 
  return (
    <div className={styles.container}>
      <span className={styles.aboutUs}>About us</span>
      <h1 className={styles.title}>What is Openlogo</h1>
      <p className={styles.description}>
        Our RCM SaaS product seamlessly integrates with your existing healthcare systems and processes, allowing for efficient and accurate data exchange.
      </p>
      <p className={styles.subDescription}>
        Our product pulls in data from electronic health records (EHRs), practice management systems, and billing software to streamline revenue cycle management.
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