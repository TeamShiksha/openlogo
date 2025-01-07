import { useEffect, useState, useCallback, useMemo } from "react";
import CustomInput from "../common/input/CustomInput";
import styles from "./SignForm.module.css";
import Button from "../common/button/Button";
import PropTypes from "prop-types";
import { isValidEmail, isValidPassword } from "../../utils/helpers";
import axios from "axios";

function SignUpForm({ toggleForm }) {
  // Initial values for the form
  const initialValues = useMemo(
    () => ({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
    [],
  );

  // State hooks
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form value change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "name" ? value.replace(/[^a-zA-Z\s]/g, "") : value,
    }));
  };

  // Reset form state
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setFormErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmit(false);
  }, [initialValues]);

  // Form validation function
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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setErrorMessage(Object.values(errors)[0] || "");

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
      try {
        const response = await axios.post("/api/auth/signup", formValues);

        if (response.status === 200) {
          setSuccessMessage("Signed up successfully");
          setTimeout(() => {
            resetForm();
            toggleForm();  // Switch to the sign-in form after success
          }, 1500);
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "An error occurred during signup"
        );
        setIsSubmit(false);
      }
    }
  };

  // Effect to track form submission
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("Form submitted successfully");
    }
  }, [formErrors, isSubmit]);

  return (
    <div className={styles.pageDiv}>
      <form noValidate className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Sign up for free</h2>

        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        {errorMessage && (
          <p className={styles.errorMessage}>{errorMessage}</p>
        )}

        <CustomInput
          type="text"
          name="name"
          label="Name"
          className={styles.input}
          value={formValues.name}
          onChange={handleChange}
          required
        />

        <CustomInput
          type="text"
          name="email"
          label="Email"
          className={styles.input}
          value={formValues.email}
          onChange={handleChange}
          required
        />

        <CustomInput
          type="password"
          name="password"
          label="Password"
          className={styles.input}
          value={formValues.password}
          onChange={handleChange}
          required
        />

        <CustomInput
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          className={styles.input}
          value={formValues.confirmPassword}
          onChange={handleChange}
          required
        />

        <div className={styles.inputGroup}>
          <Button
            type="submit"
            variant="primary"
            className={styles.signbutton}
          >
            Sign up
          </Button>
        </div>
      </form>
    </div>
  );
}

SignUpForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
};

export default SignUpForm;
