import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./CustomInput.module.css";

function CustomInput({ type, name, label, value, onChange, error, className }) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = (e) => {
    e.target.select();
    setIsFocused(true);
  };
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={styles.group}>
      <input
        type={type}
        id={label}
        name={name}
        className={`${styles["group-input"]} ${className}`}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={onChange}
      />
      <label
        className={`${styles["input-label"]} ${
          isFocused || value ? styles["label-active"] : ""
        }`}
        htmlFor={label}
      >
        {label}
      </label>
      {error && <p className={styles["input-error"]}>{error}</p>}
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  className: PropTypes.string,
};

export default CustomInput;
