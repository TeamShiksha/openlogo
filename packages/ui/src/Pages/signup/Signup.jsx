import { useEffect, useState } from "react"; 
import styles from "./Signup.module.css";
import PropTypes from "prop-types";
import Modal from "../../components/common/modal/Modal";
import { isValidEmail, isValidPassword } from "../../utils/helpers";  

function Signup({ isOpen, onClose }) {
  const initialValues = { name: "", email: "", password: "", confirmPassword: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: name === "name" ? value.replace(/[^a-zA-Z\s]/g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    setErrorMessage(Object.values(errors)[0] || ""); 

    if (Object.keys(errors).length === 0) {
      setIsSubmit(true);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/auth/signup",
          formValues,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true, // Required for credentials
          }
        );
        

        if (response.status === 200) {
          setSuccessMessage("Signed up successfully");
          setFormValues(initialValues);
        } else {
          setErrorMessage(response.data.message || "Something went wrong");
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "An error occurred during signup");
      } finally {
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
      console.log("Form submitted successfully", formValues);
    }
  }, [formErrors, isSubmit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const backdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div
        className={styles.pageDiv}
        role="button"
        tabIndex="0"
        onClick={backdropClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            backdropClick(e);
          }
        }}
      >
        <form noValidate className={styles.formBox} onSubmit={handleSubmit}>
          <h2 id="signup-title" className={styles.formTitle}>Sign up for free</h2>
          <div className={styles.alertmessage}>
            {Object.keys(formErrors).length === 0 && isSubmit && (
              <p className={styles.successMessage}>Signed up successfully</p>
            )}
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formValues.name}
              onChange={handleChange}
              required
              aria-invalid={formErrors.name ? "true" : "false"}
            />
            <label className={styles.userLabel} htmlFor="name">Name</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="email"
              name="email"
              className={styles.input}
              value={formValues.email}
              onChange={handleChange}
              required
              aria-invalid={formErrors.email ? "true" : "false"}
            />
            <label className={styles.userLabel} htmlFor="email">Email</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={formValues.password}
              onChange={handleChange}
              required
              aria-invalid={formErrors.password ? "true" : "false"}
            />
            <label className={styles.userLabel} htmlFor="password">Password</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={styles.input}
              value={formValues.confirmPassword}
              onChange={handleChange}
              required
              aria-invalid={formErrors.confirmPassword ? "true" : "false"}
            />
            <label className={styles.userLabel} htmlFor="confirmPassword">Confirm Password</label>
          </div>

          <div className={styles.inputGroup}>
            <button type="submit" className={styles.submitButton}>Sign up</button>
          </div>

          <div className={styles.inputActiontext}>
            <span>Already have an account?</span>
            <span>Sign in</span>
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