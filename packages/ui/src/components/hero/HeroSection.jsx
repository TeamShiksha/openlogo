import { useState } from "react";
import Button from "../common/button/Button";
import AuthModal from "../auth/Auth";
import { HERO_SECTION, BUTTON_TEXT } from "../../utils/Constants";
import styles from "./HeroSection.module.css";

const HeroSection = () => {
  const [signupModal, setSignupModal] = useState(false);
  const closeSignupModal = () => {
    setSignupModal(false);
  };

  return (
    <div className={styles["hero-section"]}>
      <div className={styles["left-section"]}>
        <div className={styles["text-section"]}>
          <h1>{HERO_SECTION.tagLine}</h1>
          <p>{HERO_SECTION.summary}</p>
        </div>
        <div className={styles["button-section"]}>
          <Button
            type="button"
            variant="secondary"
            className={styles["button-width"]}
          >
            {BUTTON_TEXT.documentation}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => setSignupModal(true)}
            className={styles["button-width"]}
          >
            {BUTTON_TEXT.getStarted}
          </Button>
          <AuthModal isOpen={signupModal} onClose={closeSignupModal} />
        </div>
      </div>
      <div>
        <img
          alt={HERO_SECTION.illustractionSrcAlt}
          src={HERO_SECTION.illustractionSrc}
          className={styles["logo-images"]}
        />
      </div>
    </div>
  );
};

export default HeroSection;
