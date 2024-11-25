import Button from "../common/button/Button";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  return (
    <div className={styles["hero-section"]}>
      <div className={styles["left-section"]}>
        <div className={styles["text-section"]}>
          <h1>Access hundreds of logos with just one line of code</h1>
          <p>
            A collection of APIs designed to simplify the process of obtaining
            company logos. Generate API keys in seconds
          </p>
        </div>
        <div className={styles["button-section"]}>
          <Button variant="secondary">
            <div className={styles["button-text"]}>
              <img alt="Play Icon" src="play-icon.svg" height={20} width={20} />
              <span>Documentation</span>
            </div>
          </Button>
          <Button variant="primary">Get started</Button>
        </div>
      </div>
      <div className={styles["right-section"]}>
        <img
          alt="Logo Images"
          src="logo-images.png"
          height={358}
          width={326}
          className={styles["logo-images"]}
        />
      </div>
    </div>
  );
};

export default HeroSection;
