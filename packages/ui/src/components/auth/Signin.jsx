import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { BUTTON_TEXT, SIGNIN } from "../../utils/Constants";
import styles from "./SignForm.module.css";
import { validate } from "../../utils/Helpers";
import { useApi } from "../../hooks/useApi";
import { AuthContext } from "../../contexts/Contexts";

const SignIn = ({ toggleForm, onClose }) => {
  const [formData, setFormData] = useState(SIGNIN.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const { makeRequest, errorMsg } = useApi({
    method: "post",
    url: isForgotPassword ? `/auth/forgot-password` : `/auth/signin`,

    data: formData,
  });

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
    const errors = validate({ email: formData.email });
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsSubmit(true);
    const success = await makeRequest();
    if (success) {
      if (isForgotPassword) {
        setIsForgotPassword(false);
      } else {
        setFormData(SIGNIN.initialValues);
        setIsAuthenticated(true);
        onClose();
      }

      setIsSubmit(false);
      setFocusedField(null);
    }
  };
  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
        <h2 className={styles.title}>{SIGNIN.title}</h2>
        <div className={`"error-container" ${errorMsg ? "has-error" : ""}`}>
          <p className="input-error">{errorMsg}</p>
        </div>
        <div className={styles["form-width"]}>
          {SIGNIN["fields"]
            .filter((field) => !isForgotPassword || field.name !== "password")
            .map((field) => (
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
        {isForgotPassword ? (
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid && isSubmit}
          >
            Submit
          </Button>
        ) : (
          <>
            <p
              className={styles["forgot-password"]}
              onClick={() => setIsForgotPassword(true)}
            >
              {BUTTON_TEXT.forgotPassword}
            </p>
            <Button
              type="submit"
              variant="primary"
              disabled={!isFormValid && isSubmit}
            >
              {BUTTON_TEXT.signIn}
            </Button>
          </>
        )}
      </form>
      <hr className={styles.separator} />
      {isForgotPassword && (
        <p
          onClick={() => setIsForgotPassword(false)} // Switch back to sign-in
          className={styles.switch}
        >
          Back to Sign In
        </p>
      )}
      {!isForgotPassword && (
        <p onClick={toggleForm} className={styles.switch}>
          {SIGNIN.footerText}
        </p>
      )}
    </>
  );
};
SignIn.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default SignIn;
