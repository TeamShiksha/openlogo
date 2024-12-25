import styles from "./CustomInput.module.css";
import PropTypes from 'prop-types';

function CustomInput({ type, name, label, error, className }) {
  return (
    <div className={styles.customInputGroup}>
      <input
        type={type}
        id={label}
        name={name}
        className={`${styles.customInput} ${className}`}
      />
      <label className={styles.customInputLabel} htmlFor={label}>
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
	className: PropTypes.string.isRequired
};

export default CustomInput;
