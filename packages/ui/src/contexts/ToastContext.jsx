import { useState, useCallback, useMemo } from "react";
import styles from "../components/Toast/Toast.module.css";
import PropTypes from "prop-types";
import { ToastContext } from "./Contexts";
import Toast from "../components/toast/Toast.jsx";

export const ToastProvider = ({ children, maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const id = Date.now();
      const { type = "info", duration = 5000 } = options;

      setToasts((prevToasts) => {
        const updatedToasts = [...prevToasts, { id, message, type, duration }];
        return updatedToasts.slice(-maxToasts);
      });

      return id;
    },
    [maxToasts]
  );

  const success = useCallback(
    (message, options = {}) => {
      return showToast(message, { ...options, type: "success" });
    },
    [showToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return showToast(message, { ...options, type: "error" });
    },
    [showToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return showToast(message, { ...options, type: "warning" });
    },
    [showToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return showToast(message, { ...options, type: "info" });
    },
    [showToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const toastValue = useMemo(
    () => ({
      success,
      error,
      warning,
      info,
      show: showToast,
      clear: clearAll,
      clearToast: removeToast,
    }),
    [success, error, warning, info, showToast, clearAll, removeToast]
  );

  return (
    <ToastContext.Provider value={toastValue}>
      <div className={styles["toast-container"]} aria-label="Notifications">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node,
  maxToasts: PropTypes.number,
};
