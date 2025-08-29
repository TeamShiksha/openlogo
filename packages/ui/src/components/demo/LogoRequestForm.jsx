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
  const [requestFormValues, setRequestFormValues] = useState(
    LOGOREQUEST.initialValues
  );
  const [requestFormErrors, setRequestFormErrors] = useState({});
  const [isRequestFormValid, setIsRequestFormValid] = useState(false);
  const [activeFormField, setActiveFormField] = useState(null);
  const toast = useToast();
  const { makeRequest, loading, data, errorMsg } = useApi({
    url: "/requests/",
    method: "POST",
    data: { companyUrl: requestFormValues.companyUrl },
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRequestFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();
    await makeRequest();
  };

  // on success or Error response
  useEffect(() => {
    if (errorMsg || data?.message) {
      if (errorMsg) {
        toast.error(errorMsg);
      } else if (data?.message) {
        toast.success(data.message);
      }
      const timeId = setTimeout(() => {
        setRequestFormErrors({});
        setActiveFormField(null);
        setRequestFormValues(LOGOREQUEST.initialValues);
        closeModal();
      }, 500);
      return () => clearTimeout(timeId);
    }
  }, [errorMsg, data, toast, closeModal]);

  useEffect(() => {
    if (!activeFormField) {
      const filledFields = Object.keys(requestFormValues).filter(
        (field) => requestFormValues[field] !== LOGOREQUEST.initialValues[field]
      );
      const errors = validate(
        filledFields.reduce((acc, field) => {
          acc[field] = requestFormValues[field];
          return acc;
        }, {})
      );
      setRequestFormErrors(errors);
      return;
    }

    // Show validation error immediately on focus
    const validationErrors = validate({
      [activeFormField]: requestFormValues[activeFormField],
    });
    setRequestFormErrors((prevErrors) => ({
      ...prevErrors,
      [activeFormField]: validationErrors[activeFormField],
    }));

    // Then update after delay if value changes
    const timeId = setTimeout(() => {
      const updatedErrors = validate({
        [activeFormField]: requestFormValues[activeFormField],
      });
      setRequestFormErrors((prevErrors) => ({
        ...prevErrors,
        [activeFormField]: updatedErrors[activeFormField],
      }));
    }, 500);

    return () => clearTimeout(timeId);
  }, [activeFormField, requestFormValues]);

  //overall validation
  useEffect(() => {
    const errors = validate(requestFormValues);
    setIsRequestFormValid(Object.keys(errors).length === 0);
  }, [requestFormValues]);

  return (
    <Modal onClose={closeModal} isOpen={true}>
      <form onSubmit={handleSubmit} className={styles["logo-request-form"]}>
        <h3 className={styles["logo-form-title"]}>{LOGOREQUEST.title}</h3>
        <div className={styles["logo-form-content"]}>
          <CustomInput
            error={requestFormErrors["companyUrl"]}
            label="Company Url"
            type="text"
            name="companyUrl"
            value={requestFormValues["companyUrl"]}
            onChange={handleInputChange}
            onFocus={() => setActiveFormField("companyUrl")}
            onBlur={() => setActiveFormField(null)}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isRequestFormValid}
          isLoading={loading}
        >
          {BUTTON_TEXT.sendRequest}
        </Button>
      </form>
    </Modal>
  );
};

LogoRequestForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default LogoRequestForm;
