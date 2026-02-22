import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";

function Dropdown({
  options,
  selectedOption,
  setSelectedOption,
  className = "",
  valueKey = null,
  labelKey = null,
  testId = "testid-dropdown",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const isObjectArray = options?.length > 0 && typeof options[0] === "object";

  const handleOptionClick = (value) => {
    setSelectedOption(value);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = () => {
    if (!selectedOption) return "Select Option";
    if (isObjectArray) {
      const option = options.find((opt) => {
        const val = valueKey ? opt[valueKey] : opt.value;
        return val === selectedOption;
      });
      return option
        ? labelKey
          ? option[labelKey]
          : option.label
        : selectedOption;
    }
    return selectedOption.toUpperCase();
  };

  return (
    <div ref={dropdownRef} className={`${styles["dropdown-div"]} ${className}`}>
      <select
        data-testid={testId}
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        className={styles["sr-only"]}
        aria-hidden="false"
      >
        {options?.map((option) => {
          const value = isObjectArray
            ? valueKey
              ? option[valueKey]
              : option.value
            : option;
          const label = isObjectArray
            ? labelKey
              ? option[labelKey]
              : option.label
            : option.toUpperCase();
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>

      <div
        className={`${styles["dropdown-trigger"]} ${isOpen ? styles["is-open"] : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{getLabel()}</span>
        <ChevronDown size={16} className={styles["arrow-icon"]} />
      </div>

      {isOpen && (
        <div className={styles["dropdown-menu"]} role="listbox">
          {options?.map((option) => {
            const value = isObjectArray
              ? valueKey
                ? option[valueKey]
                : option.value
              : option;
            const label = isObjectArray
              ? labelKey
                ? option[labelKey]
                : option.label
              : option.toUpperCase();
            const isSelected = value === selectedOption;

            return (
              <div
                key={value}
                className={`${styles["dropdown-item"]} ${isSelected ? styles["selected"] : ""}`}
                onClick={() => handleOptionClick(value)}
                role="option"
                aria-selected={isSelected}
              >
                {label}
              </div>
            );
          })}
        </div>
      )}
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
