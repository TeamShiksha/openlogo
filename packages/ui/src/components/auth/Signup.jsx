import { useState, useEffect } from "react";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import PropTypes from "prop-types";
import { SIGNUP, BUTTON_TEXT, MESSAGES } from "../../utils/Constants";
import styles from "./SignForm.module.css";
import { validate } from "../../utils/Helpers";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast.js";

function SignUp({ toggleForm }) {
  const toast = useToast();
  const [formValues, setFormValues] = useState(SIGNUP.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { makeRequest, errorMsg } = useApi({
    url: `/auth/signup`,
    method: "post",
    data: formValues,
  });

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  useEffect(() => {
    if (!focusedField) {
      setFormErrors({});
      return;
    }
    const timeout = setTimeout(() => {
      const validationErrors = validate({
        [focusedField]: formValues[focusedField],
        password: formValues.password,
      });
      setFormErrors({
        [focusedField]: validationErrors[focusedField] || "",
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [focusedField, formValues]);

  useEffect(() => {
    const errors = validate(formValues);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    setFormErrors({});
    setFocusedField(null);
    setIsLoading(true);

    const success = await makeRequest();
    if (success) {
      setFormValues(SIGNUP.initialValues);
      setFocusedField(null);
      toggleForm();
      toast.success(MESSAGES.SIGN_UP_SUCCESS);
    }
    setIsLoading(false);
  };

  return (
    <>
      <form
        noValidate
        className={styles.form}
        data-testid="signup-form"
        onSubmit={handleSubmit}
      >
        <h2 className={styles.title}>{SIGNUP.title}</h2>
        <div className={`"error-container" ${errorMsg ? "has-error" : ""}`}>
          <p className="input-error">{errorMsg}</p>
        </div>
        <div className={styles["form-width"]}>
          {SIGNUP["fields"].map((field) => (
            <CustomInput
              error={formErrors[field.name]}
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formValues[field.name]}
              onChange={handleChange}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
              disabled={isLoading}
            />
          ))}
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isLoading}
          isLoading={isLoading}
        >
          {BUTTON_TEXT.signUp}
        </Button>
      </form>
      <hr className={styles.separator} />
      <p onClick={toggleForm} className={styles.switch}>
        {SIGNUP.footerText}
      </p>
    </>
  );
}

SignUp.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

export default SignUp;
