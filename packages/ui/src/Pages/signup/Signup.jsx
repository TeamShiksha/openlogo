import { useEffect, useState } from "react";
import styles from "./Signup.module.css";
import PropTypes from "prop-types";
import Modal from "../../components/common/modal/Modal";

function Signup({ isOpen, onClose }) {
  const initialValues = { name: "", email: "", password: "", confirmPassword: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [errorMessage, settErrorMessage] = useState(""); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
      setFormValues({ ...formValues, [name]: filteredValue });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(formValues);
    setFormErrors(errors);
    settErrorMessage(Object.values(errors)[0] || ""); 
    setIsSubmit(true);
  };

  const PASSWORD_RULES = {
    minLength: 6,
    maxLength: 20,
    requiresUppercase: true,
    requiresLowercase: true,
    requiresDigit: true,
    requiresSpecialChar: true,
    specialCharRegex: /[!@#$%^&*(),.?":{}|<>]/,  
  };
  
  const validatePassword = (password) => {
    const errors = {};
  
    if (!password) {
      errors.password = "Password is required!";
    } else {
      if (password.length < PASSWORD_RULES.minLength) {
        errors.password = `Password must be at least ${PASSWORD_RULES.minLength} characters long!`;
      }
  
      if (password.length > PASSWORD_RULES.maxLength) {
        errors.password = `Password cannot be more than ${PASSWORD_RULES.maxLength} characters!`;
      }
  
      if (PASSWORD_RULES.requiresUppercase && !/[A-Z]/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter!";
      }
  
      if (PASSWORD_RULES.requiresLowercase && !/[a-z]/.test(password)) {
        errors.password = "Password must contain at least one lowercase letter!";
      }
  
      if (PASSWORD_RULES.requiresDigit && !/\d/.test(password)) {
        errors.password = "Password must contain at least one digit!";
      }
  
      if (PASSWORD_RULES.requiresSpecialChar && !PASSWORD_RULES.specialCharRegex.test(password)) {
        errors.password = "Password must contain at least one special character!";
      }
    }
  
    return errors;
  };
  

  const validate = (values) => {
    const errors = {};
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

    if (!values.name) {
      errors.name = "Name is required!";
    } else if (!/^[a-zA-Z\s]*$/.test(values.name)) {
      errors.name = "Name can only contain letters and spaces!";
    }

    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regexEmail.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }

    const passwordErrors = validatePassword(values.password);
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
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const backdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="medium">
      <div className={styles.pageDiv} onClick={backdropClick}>
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div className="ui message success">Signed up successfully</div>
        ) : null}

        <form noValidate className={styles.formBox} onSubmit={handleSubmit}>
          <h2 id="signup-title" className={styles.formTitle}>
            Sign up for free
          </h2>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

          <div className={styles.inputGroup}>
            <input
              type="text"
              id="name"
              name="name"
              className={styles.input}
              value={formValues.name}
              onChange={handleChange}
              required
            />
            <label className={styles.userLabel} htmlFor="name">
              Name
            </label>
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
            />
            <label className={styles.userLabel} htmlFor="email">
              Email
            </label>
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
            />
            <label className={styles.userLabel} htmlFor="password">
              Password
            </label>
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
            />
            <label className={styles.userLabel} htmlFor="confirmPassword">
              Confirm Password
            </label>
          </div>

          <div className={styles.inputGroup}>
            <button type="submit" className={styles.submitButton}>
              Sign up
            </button>
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
