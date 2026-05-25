import { useState, useEffect } from "react";
import { Eye, EyeClosed } from "lucide-react";
import CustomInput from "../common/input/CustomInput";
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
      className={styles["change-password-input-group"]}
    >
      {CHANGE_PASSWORD_FIELDS.map((field) => {
        if (field.name === "currPassword") {
          return (
            <div key={field.name} className={styles["change-password-wrapper"]}>
              <CustomInput
                error={errors[field.name]}
                type={showCurrentPassword ? "text" : "password"}
                name={field.name}
                label={field.label}
                value={formValues[field.name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(field.name)}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
              <button
                type="button"
                className={styles["change-password-eye-button"]}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
                tabIndex={-1}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowCurrentPassword(!showCurrentPassword);
                  }
                }}
              >
                {showCurrentPassword ? (
                  <Eye size={20} />
                ) : (
                  <EyeClosed size={20} />
                )}
              </button>
            </div>
          );
        }
        if (field.name === "newPassword") {
          return (
            <div key={field.name} className={styles["change-password-wrapper"]}>
              <CustomInput
                error={errors[field.name]}
                type={showNewPassword ? "text" : "password"}
                name={field.name}
                label={field.label}
                value={formValues[field.name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(field.name)}
                onBlur={() => setFocusedField(null)}
                disabled={loading}
              />
              <button
                type="button"
                className={styles["change-password-eye-button"]}
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                tabIndex={-1}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setShowNewPassword(!showNewPassword);
                  }
                }}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>
          );
        }
        return (
          <CustomInput
            key={field.name}
            type={field.type}
            name={field.name}
            label={field.label}
            value={formValues[field.name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(field.name)}
            onBlur={() => setFocusedField(null)}
            error={errors[field.name]}
          />
        );
      })}
      <Button
        type="submit"
        variant="primary"
        disabled={isFormInvalid}
        isLoading={loading}
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
