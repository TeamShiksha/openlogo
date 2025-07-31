import { useState, useEffect } from "react";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import styles from "./ChangePassword.module.css";
import PropTypes from "prop-types";
import { BUTTON_TEXT, CHANGE_PASSWORD_FIELDS } from "../../utils/Constants";
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
    data,
    errorMsg,
    isSuccess,
    loading,
  } = useApi({
    method: "put",
    url: "/users/me/password",
    data: {
      currPassword: formValues.currPassword,
      newPassword: formValues.newPassword,
    },
  });

  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (!focusedField) {
      setErrors({});
      return;
    }
    const timeout = setTimeout(() => {
      const validationErrors = validateChangePassword({
        [focusedField]: formValues[focusedField],
      });
      setErrors({
        [focusedField]: validationErrors[focusedField] || "",
      });
    }, 500);
    return () => clearTimeout(timeout);
  }, [focusedField, formValues]);

  useEffect(() => {
    if (!submitted || loading) return;
    if (data?.statusCode === 200) {
      toast.success(data?.message || "Your password updated successfully");
      setFormValues({ currPassword: "", newPassword: "" });
      setErrors({});
    } else if (
      data?.statusCode === 400 ||
      errorMsg?.toLowerCase().includes("incorrect")
    ) {
      toast.error("Incorrect current password");
    } else {
      toast.error(errorMsg || "Something went wrong");
    }
    setSubmitted(false);
  }, [data, errorMsg, isSuccess, loading, submitted, toast]);

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
    setSubmitted(true);
    await updatePasswordRequest();
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
      {CHANGE_PASSWORD_FIELDS.map((field) => (
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
      ))}
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
