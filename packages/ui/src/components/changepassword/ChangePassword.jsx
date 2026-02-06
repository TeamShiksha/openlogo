import { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import Button from "../common/button/Button";
import styles from "./ChangePassword.module.css";
import PropTypes from "prop-types";
import {
  BUTTON_TEXT,
  CHANGE_PASSWORD_FIELDS,
  MESSAGES,
} from "../../utils/Constants";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { validateChangePassword } from "../../utils/Helpers";

function ChangePassword({ isGuest }) {
  const [formValues, setFormValues] = useState({
    currPassword: "",
    newPassword: "",
  });

  const {
    makeRequest: updatePasswordRequest,
    errorMsg,
    loading,
  } = useApi({
    method: "put",
    url: "user/password",
    data: {
      currPassword: formValues.currPassword,
      newPassword: formValues.newPassword,
    },
  });

  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (!focusedField) {
      setErrors({});
      return;
    }

    const timeout = setTimeout(() => {
      const validationErrors = validateChangePassword(formValues);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [focusedField]: validationErrors[focusedField] || "",
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [focusedField, formValues]);

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateChangePassword(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    const success = await updatePasswordRequest();
    if (success) {
      setErrors({});
      toast.success(MESSAGES.UPDATE_PASSWORD_SUCCESS);
      setFormValues({
        currPassword: "",
        newPassword: "",
      });
      setFocusedField(null);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
    }
  };

  const isFormInvalid =
    isGuest ||
    Object.values(errors).some((error) => error) ||
    Object.values(formValues).some((val) => !val) ||
    loading;

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={styles["change-password-form"]}
    >
      {CHANGE_PASSWORD_FIELDS.map((field) => {
        const isCurrentPassword = field.name === "currPassword";
        const isNewPassword = field.name === "newPassword";
        const showPassword = isCurrentPassword
          ? showCurrentPassword
          : showNewPassword;
        const togglePassword = isCurrentPassword
          ? setShowCurrentPassword
          : setShowNewPassword;

        return (
          <div key={field.name} className={styles["form-group"]}>
            <div className={styles["password-wrapper"]}>
              <input
                type={showPassword ? "text" : "password"}
                name={field.name}
                placeholder={field.label}
                value={formValues[field.name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(field.name)}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
                className={styles["input"]}
              />
              <button
                type="button"
                className={styles["eye-button"]}
                onClick={() => togglePassword(!showPassword)}
                aria-label={
                  showPassword ? `Hide ${field.label}` : `Show ${field.label}`
                }
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
              </button>
            </div>
            {errors[field.name] && (
              <span className={styles["error-message"]}>
                {errors[field.name]}
              </span>
            )}
          </div>
        );
      })}
      <Button
        type="submit"
        variant="primary"
        disabled={isFormInvalid}
        isLoading={loading}
        className={styles["submit-btn"]}
      >
        {BUTTON_TEXT.changePasswordLabel}
      </Button>
    </form>
  );
}

ChangePassword.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default ChangePassword;
