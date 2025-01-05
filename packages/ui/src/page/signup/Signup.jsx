import { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import PropTypes from "prop-types";
import Modal from "../../components/common/modal/Modal";
import { isValidEmail, isValidPassword } from "../../utils/helpers";
import axios from "axios";
import CustomInput from "../../components/common/input/CustomInput";

function Signup({ isOpen, onClose }) {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "name" ? value.replace(/[^a-zA-Z\s]/g, "") : value,
    }));
  };

  const resetForm = () => {
    setFormValues(initialValues);
    setFormErrors({});
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmit(false);
  };

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
            onClose();
          }, 1500);
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "An error occurred during signup",
        );
        setIsSubmit(false);
      }
    }
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

  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log("Form submitted successfully");
    }
  }, [formErrors, isSubmit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        resetForm();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="medium">
      <div className={styles.pageDiv}>
        <form noValidate className={styles.formBox} onSubmit={handleSubmit}>
          <h2 id="signup-title" className={styles.formTitle}>
            Sign up for free
          </h2>
          <div className={styles.alertmessage}>
            {successMessage && (
              <p className={styles.successMessage}>{successMessage}</p>
            )}
            {errorMessage && (
              <p className={styles.errorMessage}>{errorMessage}</p>
            )}
          </div>

          <CustomInput
            type="text"
            name="name"
            label="Name"
            className={styles.input}
            value={formValues.name}
            onChange={handleChange}
            required={true}
          />

          <CustomInput
            type="text"
            name="email"
            label="Email"
            className={styles.input}
            value={formValues.email}
            onChange={handleChange}
            required={true}
          />

          <CustomInput
            type="password"
            name="password"
            label="Password"
            className={styles.input}
            value={formValues.password}
            onChange={handleChange}
            required={true}
          />

          <CustomInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            className={styles.input}
            value={formValues.confirmPassword}
            onChange={handleChange}
            required={true}
          />

          <div className={styles.inputGroup}>
            <button type="submit" className={styles.submitButton}>
              Sign up
            </button>
          </div>

          <div className={styles.inputActiontext}>
            <span>Already have an account?</span>
            <span className={styles.signIn}>Sign in</span>
          </div>
        </form>
      </div>
    </Modal>
  );
}

Signup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Signup;
