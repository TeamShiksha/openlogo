import Modal from "../common/modal/Modal";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import PropTypes from "prop-types";
import { useApi } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import styles from "./LogoRequestForm.module.css";
import { validate } from "../../utils/Helpers";
import { BUTTON_TEXT, LOGOREQUEST } from "../../utils/Constants";

const LogoRequestForm = ({ closeModal }) => {
  const [formValues, setFormValues] = useState(LOGOREQUEST.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const toast = useToast();
  const { makeRequest, loading, data, errorMsg } = useApi({
    url: "/requests/",
    method: "POST",
    data: { companyUrl: formValues.companyUrl },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    await makeRequest();
  };

  // on error response
  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      const timeout = setTimeout(() => {
        setFormErrors({});
        setFocusedField(null);
        setFormValues(LOGOREQUEST.initialValues);
        closeModal();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [errorMsg, toast, closeModal]);

  //on success response
  useEffect(() => {
    if (data?.message) {
      toast.success(data.message);
      const timeout = setTimeout(() => {
        setFormErrors({});
        setFocusedField(null);
        setFormValues(LOGOREQUEST.initialValues);
        closeModal();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [data, toast, closeModal]);

  useEffect(() => {
    if (!focusedField) {
      const filledFields = Object.keys(formValues).filter(
        (field) => formValues[field] !== LOGOREQUEST.initialValues[field]
      );
      const errors = validate(
        filledFields.reduce((acc, field) => {
          acc[field] = formValues[field];
          return acc;
        }, {})
      );
      setFormErrors(errors);
      return;
    }

    // Show validation error immediately on focus
    const validationErrors = validate({
      [focusedField]: formValues[focusedField],
    });
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [focusedField]: validationErrors[focusedField],
    }));

    // Then update after delay if value changes
    const timeout = setTimeout(() => {
      const updatedErrors = validate({
        [focusedField]: formValues[focusedField],
      });
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [focusedField]: updatedErrors[focusedField],
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [focusedField, formValues]);

  //overall validation
  useEffect(() => {
    const errors = validate(formValues);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formValues]);

  return (
    <Modal onClose={closeModal} isOpen={true}>
      <form onSubmit={handleSubmit} className={styles["logo-request-form"]}>
        <h3 className={styles["logo-form-title"]}>{LOGOREQUEST.title}</h3>
        <div className={styles["logo-form-content"]}>
          <CustomInput
            error={formErrors["companyUrl"]}
            label="Company Url"
            name="companyUrl"
            value={formValues["companyUrl"]}
            onChange={handleInputChange}
            onFocus={() => setFocusedField("companyUrl")}
            onBlur={() => setFocusedField(null)}
          />
          <textarea
            name="companyDescription"
            placeholder="Type company description here ..."
            value={formValues.companyDescription}
            onChange={handleInputChange}
            className={styles["logo-form-textarea"]}
            onFocus={() => setFocusedField("companyDescription")}
            onBlur={() => setFocusedField(null)}
          ></textarea>
          <p
            className={`${styles["input-error"]} ${formErrors.companyDescription ? styles["has-error"] : ""}`}
          >
            {formErrors.companyDescription}
          </p>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || loading}
        >
          {loading ? "Sending" : BUTTON_TEXT.sendRequest}
        </Button>
      </form>
    </Modal>
  );
};

LogoRequestForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default LogoRequestForm;
