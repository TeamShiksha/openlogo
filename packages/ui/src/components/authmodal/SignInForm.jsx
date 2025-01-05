import React, { useState } from "react";
import CustomInput from "../common/input/CustomInput";
import styles from "./SignForm.module.css";
import Button from "../common/button/Button";
import { isValidEmail } from "../../utils/helpers"; 

const SignInForm = ({ onClose }) => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setErrorMessage(Object.values(validationErrors)[0] || "");

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmit(true);
      // Simulate successful form submission
      setSuccessMessage("Signed in successfully!");
      setTimeout(() => {
        resetForm();
        onClose();  // Close modal after successful submission
      }, 1500);
    }
  };

  const validate = (values) => {
    const errors = {};

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!isValidEmail(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    if (!values.password) {
      errors.password = "Password is required!";
    }

    return errors;
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmit(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Sign in to dashboard</h2>
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>} 
      {successMessage && <p className={styles.successMessage}>{successMessage}</p>} 

      <CustomInput
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        className={styles.input} // Ensure the className is passed
      />
      <CustomInput
        type="password"
        name="password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        className={styles.input} // Ensure the className is passed
      />
        <div className={styles.inputGroup}>
            <Button
              type="submit"
              variant="primary"
              className={styles.signbutton}
            >
              Sign in
            </Button>
          </div>
      <p className={styles.forgotPassword}>Forgot Password?</p>
    </form>
  );
};

export default SignInForm;
