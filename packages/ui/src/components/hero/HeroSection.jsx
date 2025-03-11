import PropTypes from "prop-types";
import Button from "../common/button/Button";
import { HERO_SECTION, BUTTON_TEXT } from "../../utils/Constants";
import styles from "./HeroSection.module.css";

const HeroSection = ({ openAuthModal }) => {
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
            onClick={openAuthModal}
            className={styles["button-width"]}
          >
            {BUTTON_TEXT.getStarted}
          </Button>
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

HeroSection.propTypes = {
  openAuthModal: PropTypes.func.isRequired,
};

export default HeroSection;
