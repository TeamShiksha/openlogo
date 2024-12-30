import styles from "./CustomInput.module.css";
import PropTypes from "prop-types";
import { useState } from "react";

function CustomInput({ type, name, label, error, className }) {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleChange = (e) => setValue(e.target.value);

  return (
    <div className={styles.customInputGroup}>
      <input
        type={type}
        id={label}
        name={name}
        className={`${styles.customInput} ${className}`}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      <label
        className={`${styles.customInputLabel} ${
          isFocused || value ? styles.customInputLabelActive : ""
        }`}
        htmlFor={label}
      >
        {label}
      </label>
      {error && <p className={styles.customInputError}>{error}</p>}
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
  className: PropTypes.string.isRequired,
};

export default CustomInput;
