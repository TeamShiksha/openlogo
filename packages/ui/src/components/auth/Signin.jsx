import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { BUTTON_TEXT, SIGNIN } from "../../utils/Constants";
import styles from "./SignForm.module.css";
import { validate } from "../../utils/Helpers";
import { useNavigate } from "react-router-dom";

const SignIn = ({ toggleForm, onClose }) => {
  const [formData, setFormData] = useState(SIGNIN.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (focusedField !== "email") {
      setFormErrors({});
      return;
    }
    const timer = setTimeout(() => {
      const validationErrors = validate({
        [focusedField]: formData[focusedField],
      });
      setFormErrors({
        [focusedField]: validationErrors[focusedField] || "",
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [focusedField, formData]);

  useEffect(() => {
    const errors = validate(formData);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    setFormData(SIGNIN.initialValues);
    setFormErrors({});
    setIsSubmit(false);
    setFocusedField(null);
  };

  const guestSignIn = () => {
    onClose();
    if (window.location.pathname === "/dashboard") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
        <h2 className={styles.title}>{SIGNIN.title}</h2>
        <div className={styles["form-width"]}>
          {SIGNIN["fields"].map((field) => (
            <CustomInput
              error={formErrors[field.name]}
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formData[field.name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
            />
          ))}
        </div>
        <p className={styles["forgot-password"]}>
          {BUTTON_TEXT.forgotPassword}
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isSubmit}
        >
          {BUTTON_TEXT.signIn}
        </Button>
      </form>
      <p onClick={guestSignIn} className={styles["guest-sign-in"]}>
        {SIGNIN.guestAccount}
      </p>
      <p onClick={toggleForm} className={styles.switch}>
        {SIGNIN.footerText}
      </p>
    </>
  );
};

SignIn.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default SignIn;
