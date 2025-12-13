import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeClosed } from "lucide-react";
import CustomInput from "./CustomInput";
import styles from "./PasswordInput.module.css";

function PasswordInput({
  name,
  label,
  value,
  error,
  onChange = () => {},
  onFocus = () => {},
  onBlur = () => {},
  disabled = false,
  autoComplete,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <CustomInput
        type={showPassword ? "text" : "password"}
        name={name}
        label={label}
        value={value}
        error={error}
        disabled={disabled}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete={autoComplete}
      />

      <span
        role="button"
        tabIndex={-1}
        aria-label={showPassword ? "Hide password" : "Show password"}
        className={styles.eyeButton}
        onClick={handleToggle}
      >
        {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
      </span>
    </div>
  );
}

PasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  error: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
};

export default PasswordInput;
