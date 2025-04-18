import PropTypes from "prop-types";
import styles from "./CustomInput.module.css";

function CustomInput({
  type,
  name,
  label,
  value,
  error,
  onChange = () => {},
  className = "",
  onFocus = () => {},
  onBlur = () => {},
}) {
  const isFocused = false;

  return (
    <div className={styles.group}>
      <input
        type={type}
        id={label}
        name={name}
        className={`${styles["group-input"]} ${className}`}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
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
      <div className={`"error-container" ${error ? "has-error" : ""}`}>
        <p className="input-error">{error}</p>
      </div>
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  error: PropTypes.string,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default CustomInput;
