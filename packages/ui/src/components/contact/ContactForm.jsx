import { useState } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Modal from "../common/modal/Modal";
import Button from "../common/button/Button";
import styles from "./ContactForm.module.css";
import { BUTTON_TEXT, CONTACT } from "../../utils/Constants";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function ContactForm({ closeModal }) {
  const [formValues, setFormValues] = useState(CONTACT.intialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formValues.name.trim()) newErrors.name = "Name is required.";
    if (!formValues.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formValues.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formValues.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    if (validateForm()) {
      setFormValues({ name: "", email: "", message: "" });
      setTimeout(() => {
        closeModal();
      }, 5000);
    }
  };

  return (
    <Modal onClose={closeModal} isOpen={true}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.title}>{CONTACT.title}</h3>
        <div className={styles["form-width"]}>
          {CONTACT["fields"].map((field) => (
            <CustomInput
              key={field.name}
              type={field.type}
              name={field.name}
              label={field.label}
              value={formValues[field.name]}
              onChange={handleInputChange}
            />
          ))}
          <textarea
            name="message"
            placeholder={errors.message || "Type your message here ...."}
            value={formValues.message}
            onChange={handleInputChange}
            className={styles["text-area"]}
            aria-invalid={!!errors.message}
          ></textarea>
        </div>
        <Button type="submit" variant="primary" disabled={true}>
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
