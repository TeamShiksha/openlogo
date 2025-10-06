import styles from "./LoadingSpinner.module.css";
import { PropTypes } from "prop-types";

const LoadingSpinner = ({ size = 20, border = 4, color = "white" }) => {
  const spinnerStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderWidth: `${border}px`,
    borderColor: `${color} ${color} transparent ${color}`,
  };

  return (
    <div
      data-testid="spinner"
      className={styles.spinner}
      style={spinnerStyle}
    ></div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  border: PropTypes.number,
};

export default LoadingSpinner;
