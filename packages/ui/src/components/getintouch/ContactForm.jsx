import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";
import styles from "./ContactForm.module.css";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function ContactForm({ closeModal }) {
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const modalRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    const handleEscKeyPress = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [closeModal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: "" });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSuccessMessage("Message sent successfully!");
      setFormValues({ name: "", email: "", message: "" });
      setTimeout(() => {
        setSuccessMessage("");
        closeModal();
      }, 5000);
    }
  };

  return (
    <dialog className={styles.modalOverlay} open>
      <div ref={modalRef} className={styles.modalContent}>
        {successMessage && (
          <div className={styles.successNotification}>
            <p>{successMessage}</p>
          </div>
        )}
        <button
          onClick={closeModal}
          className={styles.closeButton}
          aria-label="Close"
        >
          &times;
        </button>
        <h3>Contact Us</h3>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <CustomInput
              type="text"
              name="name"
              value={formValues.name}
              label="Name"
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.name ? styles.invalid : ""}`}
            />
          </div>
          <div className={styles.formGroup}>
            <CustomInput
              type="email"
              name="email"
              value={formValues.email}
              label="Email"
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.email ? styles.invalid : ""}`}
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="message"
              placeholder={errors.message || "Type your message here ...."}
              value={formValues.message}
              onChange={handleInputChange}
              className={`${styles.textArea} ${errors.message ? styles.invalid : ""}`}
              aria-invalid={!!errors.message}
            ></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              variant="primary"
              className={styles.submitButton}
            >
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

ContactForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default ContactForm;
