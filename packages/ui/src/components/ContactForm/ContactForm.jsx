import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
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
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              placeholder={errors.name || "Your name"}
              value={formValues.name}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.name ? styles.invalid : ""}`}
              aria-invalid={!!errors.name}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder={errors.email || "Your email"}
              value={formValues.email}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.email ? styles.invalid : ""}`}
              aria-invalid={!!errors.email}
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="message"
              placeholder={errors.message || "Your message"}
              value={formValues.message}
              onChange={handleInputChange}
              className={`${styles.textArea} ${errors.message ? styles.invalid : ""}`}
              aria-invalid={!!errors.message}
            ></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              Send Message
            </button>
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
