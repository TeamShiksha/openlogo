import { useState } from "react";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import styles from "./ChangePassword.module.css";
import PropTypes from "prop-types";
import { BUTTON_TEXT, CHANGE_PASSWORD_FIELDS } from "../../utils/Constants";

function ChangePassword({ isGuest }) {
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["change-password-input-group"]}
    >
      {CHANGE_PASSWORD_FIELDS.map((field) => (
        <CustomInput
          key={field.name}
          type={field.type}
          name={field.name}
          label={field.label}
          value={formValues[field.name]}
          onChange={handleChange}
          required
        />
      ))}
      <Button type="submit" variant="primary" disabled={isGuest}>
        {BUTTON_TEXT.changePasswordLabel}
      </Button>
    </form>
  );
}

ChangePassword.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};
export default ChangePassword;
