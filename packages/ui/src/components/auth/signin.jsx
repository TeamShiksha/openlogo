import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import styles from "./SignForm.module.css";
import Button from "../common/button/Button";
import { isValidEmail, isValidPassword } from "../../utils/helpers";

const SignInForm = ({ onClose }) => {
  const initialValues = { email: "", password: "" };
  const [formData, setFormData] = useState(initialValues);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: "", message: "" });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFeedbackMessage({ type: "error", message: Object.values(validationErrors)[0] });
      return;
    }

    setFeedbackMessage({ type: "success", message: "Signed in successfully!" });

    setTimeout(() => {
      resetForm();
      onClose();
    }, 1500);
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

  const resetForm = () => {
    setFormData(initialValues);
    setFeedbackMessage({ type: "", message: "" });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.signintitle}>
        <h2 className={styles.title}>Go to dashboard</h2>
      </div>
      {feedbackMessage.message && (
        <p
          className={
            feedbackMessage.type === "success"
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {feedbackMessage.message}
        </p>
      )}

      <div className={styles.cusomeinputcss}>
        <CustomInput
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
        />
        <CustomInput
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      <p className={styles.forgotPassword}>Forgot Password?</p>

      <div className={styles.inputGroup}>
        <Button type="submit" variant="primary" className={styles.signbutton}>
          Sign in
        </Button>
      </div>
    </form>
  );
};

SignInForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SignInForm;
