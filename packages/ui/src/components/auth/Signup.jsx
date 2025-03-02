import { useState } from "react";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import PropTypes from "prop-types";
import { isValidEmail, isValidPassword } from "../../utils/Helpers";
import { SIGNUP, BUTTON_TEXT } from "../../utils/Constants";
import styles from "./SignForm.module.css";

function SignUp({ toggleForm }) {
  const [formValues, setFormValues] = useState(SIGNUP.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "name" ? value.replace(/[^a-zA-Z\s]/g, "") : value,
    }));
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = "Name is required!";
    } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
      errors.name = "Name can only contain letters and spaces!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!isValidEmail(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    const passwordErrors = isValidPassword(values.password);
    if (Object.keys(passwordErrors).length > 0) {
      errors.password = passwordErrors.password;
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = "Confirm password is required!";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Passwords do not match!";
    }

    return errors;
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    const errors = validate(formValues);
    console.log(errors, formErrors);
    setFormValues(SIGNUP.initialValues);
    setFormErrors({});
    setIsSubmit(false);
  };

  return (
    <>
      <form
        noValidate
        className={styles.form}
        data-testid="signup-form"
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>{SIGNUP.title}</h2>
        <div className={styles["form-width"]}>
          {SIGNUP["fields"].map((field) => (
            <CustomInput
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formValues[field.name]}
              onChange={handleChange}
            />
          ))}
        </div>
        <Button type="submit" variant="primary" disabled={!isSubmit}>
          {BUTTON_TEXT.signUp}
        </Button>
      </form>
      <hr className={styles.separator} />
      <p onClick={toggleForm} className={styles.switch}>
        {SIGNUP.footerText}
      </p>
    </>
  );
}

SignUp.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default SignUp;
