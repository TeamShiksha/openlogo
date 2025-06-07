import styles from "./Dropdown.module.css";
import PropTypes from "prop-types";

function Dropdown({options, selectedOption, setSelectedOption}) {

  return (
    <div className={styles["dropdown-div"]}>
      <select
        name="dropdown"
        id="dropdown"
        className={styles["dropdown"]}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        data-testid="testid-dropdown"
      >
        {options?.map((option) => (
          <option key={option} className={styles["option"]} value={option}>
            {option.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string.isRequired,
  setSelectedOption: PropTypes.func.isRequired,
};

export default Dropdown;
