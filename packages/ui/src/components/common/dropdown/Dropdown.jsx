import styles from "./Dropdown.module.css";
import PropTypes from "prop-types";

function Dropdown({
  options,
  selectedOption,
  setSelectedOption,
  className = "",
  valueKey = null,
  labelKey = null,
  testId = "testid-dropdown",
}) {
  const isObjectArray = options?.length > 0 && typeof options[0] === "object";

  return (
    <div className={`${styles["dropdown-div"]} ${className}`}>
      <select
        name="dropdown"
        id="dropdown"
        className={styles["dropdown"]}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        data-testid={testId}
      >
        {options?.map((option) => {
          if (isObjectArray) {
            const value = valueKey ? option[valueKey] : option.value;
            const label = labelKey ? option[labelKey] : option.label;
            return (
              <option key={value} className={styles["option"]} value={value}>
                {label}
              </option>
            );
          } else {
            return (
              <option key={option} className={styles["option"]} value={option}>
                {option.toUpperCase()}
              </option>
            );
          }
        })}
      </select>
    </div>
  );
}

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
  className: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  testId: PropTypes.string,
};

export default Dropdown;
