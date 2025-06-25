import { useState, useRef, useEffect } from "react";
import styles from "./Button.module.css";
import { PropTypes } from "prop-types";
import LoadingSpinner from "../loadingspinner/LoadingSpinner";

const Button = ({
  children,
  variant,
  type = "button",
  onClick = () => {},
  disabled = false,
  className = "",
  isLoading = false,
  spinnerSize,
  spinnerBorder,
  spinnerColor,
}) => {
  const [buttonWidth, setButtonWidth] = useState(null);
  const buttonRef = useRef(null);

  const captureButtonWidth = () => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  };

  useEffect(() => {
    captureButtonWidth();
    const handleResize = () => {
      if (!isLoading) {
        setButtonWidth(null);
      }
      captureButtonWidth();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isLoading]);

  const buttonStyle =
    buttonWidth && isLoading
      ? { width: `${buttonWidth}px`, minWidth: `${buttonWidth}px` }
      : {};

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${styles[variant]} ${className} ${styles.button}`}
      style={buttonStyle}
    >
      {isLoading ? (
        <LoadingSpinner
          size={spinnerSize}
          border={spinnerBorder}
          color={spinnerColor}
        />
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "danger"]).isRequired,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  isLoading: PropTypes.bool,
  spinnerSize: PropTypes.number,
  spinnerBorder: PropTypes.number,
  spinnerColor: PropTypes.string,
};

export default Button;
