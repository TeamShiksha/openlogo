import { useContext } from "react";
import { AuthContext } from "../../contexts/Contexts";
import PropTypes from "prop-types";
import tickIcon from "../../assets/Icon.svg";
import Button from "../common/button/Button";
import styles from "./PricingCard.module.css";

function PricingCard({ name, tagline, index, keypoints }) {
  const { setSignupModal } = useContext(AuthContext);
  const buttonText = index === 1 ? "Coming Soon" : "Get Started";
  const isDisabled = index === 1 ? true : false;

  const handleClick = () => {
    if (!isDisabled) {
      setSignupModal(true);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.intro}>
        <h1 className={styles["plan-name"]}>{name}</h1>
        <p className={styles["tag-line"]}>{tagline}</p>
        <ul className={styles.point}>
          {keypoints.map((keypoint, idx) => (
            <li key={keypoint + idx}>
              <img alt="Tick Icon" src={tickIcon} className={styles.point} />
              <p>{keypoint}</p>
            </li>
          ))}
        </ul>
        <Button
          variant={"primary"}
          className={styles.width}
          disabled={isDisabled}
          onClick={handleClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

PricingCard.propTypes = {
  name: PropTypes.string.isRequired,
  pricing: PropTypes.number,
  index: PropTypes.number.isRequired,
  tagline: PropTypes.string.isRequired,
  keypoints: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PricingCard;
