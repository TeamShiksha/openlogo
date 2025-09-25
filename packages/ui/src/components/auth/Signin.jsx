import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import { BUTTON_TEXT, MESSAGES, SIGNIN } from "../../utils/Constants";
import styles from "./SignForm.module.css";
import { validate } from "../../utils/Helpers";
import { useApi } from "../../hooks/useApi";
import { AuthContext } from "../../contexts/Contexts";
import { useToast } from "../../hooks/useToast.js";

const SignIn = ({ toggleForm, onClose }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(SIGNIN.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showResendVerify, setShowResendVerify] = useState(false);
  const { makeRequest, data, errorMsg } = useApi({
    method: "post",
    url: isForgotPassword ? `/auth/password/forgot` : `/auth/signin`,
    data: isForgotPassword ? { email: formData.email } : formData,
  });

  const { makeRequest: makeGuestRequest, errorMsg: guestErrorMsg } = useApi({
    method: "post",
    url: `/auth/signin?type=guest`,
  });

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  useEffect(() => {
    if (guestErrorMsg) toast.error(guestErrorMsg);
  }, [guestErrorMsg, toast]);

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
    const fieldsToValidate = { email: formData.email };
    const errors = validate(fieldsToValidate);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formData, isForgotPassword]);

  useEffect(() => {
    if (data?.statusCode === 403) {
      setShowResendVerify(true);
    }
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsLoading(true);
    const success = await makeRequest();
    if (success) {
      if (isForgotPassword) {
        toast.success("Password reset link sent to your email");
        setIsForgotPassword(false);
      } else {
        setFormData(SIGNIN.initialValues);
        setIsAuthenticated(true);
        onClose();
        navigate("/dashboard");
        toast.success(MESSAGES.SIGN_IN_SUCCESS);
      }

      setFocusedField(null);
    }
    setIsLoading(false);
  };

  const handleGuestSignIn = async (submitEvent) => {
    submitEvent.preventDefault();
    setIsSubmit(true);
    const success = await makeGuestRequest();
    if (success) {
      setIsAuthenticated(true);
      setIsSubmit(false);
      onClose();
      navigate("/dashboard");
      toast.success(MESSAGES.GUEST_SIGN_IN_SUCCESS);
    }
  };

  const handleToggleForgotPassword = () => {
    setFormErrors({});
    setFocusedField(null);
    setIsSubmit(false);
    setFormData(SIGNIN.initialValues);
    setIsForgotPassword(!isForgotPassword);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <img src="/logo-images.png" alt="openlogo" className={styles.logo} />
        <h2 className={styles.title}>{SIGNIN.title}</h2>

        <div className={styles["form-width"]}>
          {SIGNIN["fields"]
            .filter((field) => !(isForgotPassword && field.name === "password"))
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
                disabled={isLoading}
                autoComplete={field.autoComplete}
              />
            ))}
        </div>

        {isForgotPassword && (
          <p
            onClick={handleToggleForgotPassword}
            className={styles["forgot-password"]}
          >
            {BUTTON_TEXT.backToSignIn}
          </p>
        )}

        {!isForgotPassword && (
          <p
            className={styles["forgot-password"]}
            onClick={handleToggleForgotPassword}
          >
            {BUTTON_TEXT.forgotPassword}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!isFormValid || isSubmit || isLoading}
        >
          {isForgotPassword ? BUTTON_TEXT.submit : BUTTON_TEXT.signIn}
        </Button>
      </form>
      {showResendVerify && (
        <p className={styles.resendLink}>
          <Link to="/resend-verification" onClick={onClose}>
            Click here
          </Link>{" "}
          to resend verification link
        </p>
      )}
      <hr className={styles.separator} />
      <p onClick={handleGuestSignIn} className={styles["guest-sign-in"]}>
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
