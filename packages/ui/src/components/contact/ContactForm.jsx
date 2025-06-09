import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Modal from "../common/modal/Modal";
import Button from "../common/button/Button";
import styles from "./ContactForm.module.css";
import { BUTTON_TEXT, CONTACT } from "../../utils/Constants";
import { validate } from "../../utils/Helpers";
import { useApi } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";

function ContactForm({ closeModal }) {
  const [formValues, setFormValues] = useState(CONTACT.initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const { makeRequest, loading } = useApi({
    url: `/messages/contact-us`,
    method: "POST",
    data: formValues,
  });

  const toast = useToast();
  const customValidate = (values) => {
    const errors = validate(values);

    if ("name" in values) {
      if (values.name.length > 20) {
        errors.name = "Name must be 20 characters or fewer";
      }
      if (!/^[a-zA-Z0-9\s]+$/.test(values.name)) {
        errors.name = "Name is required";
      }
    }

    return errors;
  };

  useEffect(() => {
    if (!focusedField) {
      const filledFields = Object.keys(formValues).filter(
        (field) => formValues[field] !== CONTACT.initialValues[field]
      );
      const errors = customValidate(
        filledFields.reduce((acc, field) => {
          acc[field] = formValues[field];
          return acc;
        }, {})
      );
      setFormErrors(errors);
      return;
    }

    const timeout = setTimeout(() => {
      const validationErrors = customValidate({
        [focusedField]: formValues[focusedField],
      });
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [focusedField]: validationErrors[focusedField],
      }));
    }, 500);

    return () => clearTimeout(timeout);
  }, [focusedField, formValues]);

  useEffect(() => {
    const errors = validate(formValues);
    setIsFormValid(Object.keys(errors).length === 0);
  }, [formValues]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (submitEvent) => {
    submitEvent.preventDefault();

    const success = await makeRequest();
    if (!success) {
      setFormErrors({});
      setFocusedField(null);
      setFormValues(CONTACT.initialValues);
      closeModal();
      toast.error("Form already submitted, try again later");
      return;
    }
    setTimeout(() => {
      setFormErrors({});
      setFocusedField(null);
      setFormValues(CONTACT.initialValues);
      closeModal();
    }, 500);
    toast.success("Form submitted, our team will get in touch shortly");
  };

  return (
    <Modal onClose={closeModal} isOpen={true}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.title}>{CONTACT.title}</h3>
        <div className={styles["form-width"]}>
          {CONTACT["fields"].map((field) => (
            <CustomInput
              error={formErrors[field.name]}
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formValues[field.name]}
              onChange={handleInputChange}
              onFocus={() => setFocusedField(field.name)}
              onBlur={() => setFocusedField(null)}
            />
          ))}
          <textarea
            name="message"
            placeholder="Type your message here ...."
            value={formValues.message}
            onChange={handleInputChange}
            className={styles["text-area"]}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
          ></textarea>
          <div>
            <p
              className={`${styles["input-error"]} ${formErrors.message ? styles["has-error"] : ""}`}
            >
              {formErrors.message}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || loading}
        >
          {loading ? "Sending" : BUTTON_TEXT.sendMessage}
        </Button>
      </form>
    </Modal>
  );
}

ContactForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ContactForm;
