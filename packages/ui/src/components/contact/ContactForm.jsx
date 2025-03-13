import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Modal from "../common/modal/Modal";
import Button from "../common/button/Button";
import styles from "./ContactForm.module.css";
import { BUTTON_TEXT, CONTACT } from "../../utils/Constants";
import { validate } from "../../utils/Helpers";

function ContactForm({ closeModal }) {
  const [formValues, setFormValues] = useState(CONTACT.intialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!focusedField) {
      setFormErrors({});
      return;
    }
    const timeout = setTimeout(() => {
      const validationErrors = validate({
        [focusedField]: formValues[focusedField],
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    setFormValues(CONTACT.intialValues);
    setFormErrors({});
    setIsSubmit(false);
    setFocusedField(null);
    setTimeout(() => {
      closeModal();
    }, 5000);
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
          <p className={styles["input-error"]}>{formErrors.message}</p>
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isFormValid || isSubmit}
        >
          {BUTTON_TEXT.sendMessage}
        </Button>
      </form>
    </Modal>
  );
}

ContactForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ContactForm;
