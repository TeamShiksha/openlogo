import { useState } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { isValidEmail, isValidPassword } from "../../utils/Helpers";
import { BUTTON_TEXT, SIGNIN } from "../../utils/Constants";
import styles from "./SignForm.module.css";

const SignIn = ({ toggleForm, onClose }) => {
  const [formData, setFormData] = useState(SIGNIN.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    const errors = validate(formData);
    console.log(errors, formErrors);
    setFormData(SIGNIN.initialValues);
    setFormErrors({});
    setIsSubmit(false);
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!isValidEmail(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    const passwordErrors = isValidPassword(values.password);
    if (Object.keys(passwordErrors).length > 0) {
      errors.password = passwordErrors.password;
    }
    return errors;
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
        <h2 className={styles.title}>{SIGNIN.title}</h2>
        <div className={styles["form-width"]}>
          {SIGNIN["fields"].map((field) => (
            <CustomInput
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>
        <p className={styles["forgot-password"]}>
          {BUTTON_TEXT.forgotPassword}
        </p>
        <Button type="submit" variant="primary" disabled={!isSubmit}>
          {BUTTON_TEXT.signIn}
        </Button>
      </form>
      <hr className={styles.separator} />
      <span onClick={toggleForm} className={styles.switch}>
        {SIGNIN.footerText}
      </span>
      <button onClick={onClose} className={styles.cross}>
        {BUTTON_TEXT.cross}
      </button>
    </>
  );
};

SignIn.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SignIn;
