import { useEffect, useRef, useState } from "react";
import styles from "./Toast.module.css";
import PropTypes from "prop-types";
import { BUTTON_TEXT } from "../../utils/Constants.js";

const Toast = ({ message, type = "info", duration = 5000, onClose, id }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const progressIntervalRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    const intervalTime = 10;
    const steps = duration / intervalTime;
    const decrementPerStep = 100 / steps;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        return Math.max(prev - decrementPerStep, 0);
      });
    }, intervalTime);

    timerRef.current = setTimeout(() => {
      handleClose();
    }, duration);
  };

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(progressIntervalRef.current);
      clearTimeout(timerRef.current);
    };
  }, [duration]);

  const handleMouseEnter = () => {
    clearInterval(progressIntervalRef.current);
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    startTimer();
  };

  const handleClose = () => {
    setIsExiting(true);
    clearInterval(progressIntervalRef.current);
    clearTimeout(timerRef.current);

    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 300);
  };

  const toastClassName = `${styles.toast} ${styles[type]} ${isExiting ? styles.exiting : ""}`;

  return (
    <div
      className={toastClassName}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
    >
      <p className={styles.message}>{message}</p>
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Close notification"
      >
        {BUTTON_TEXT.cross}
      </button>
      <div className={styles.progressBar} style={{ width: `${progress}%` }} />
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "warning", "info"]),
  duration: PropTypes.number,
  onClose: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Toast;
