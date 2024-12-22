import React, { useState } from "react";
import styles from "./ContactForm.module.css";

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
    } else if (!/^\S+@\S+\.\S+$/.test(formValues.email)) {
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
    <div
      className={styles.modalOverlay}
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className={styles.modalContent}>
      
        {successMessage && (
          <div className={styles.successNotification}>
            <p>{successMessage}</p>
          </div>
        )}

        <h3>Contact Us</h3>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              name="name"
              placeholder={errors.name ? errors.name : "Your name"}
              value={formValues.name}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.name ? styles.invalid : ""}`}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder={errors.email ? errors.email : "Your email"}
              value={formValues.email}
              onChange={handleInputChange}
              className={`${styles.inputField} ${errors.email ? styles.invalid : ""}`}
            />
          </div>
          <div className={styles.formGroup}>
            <textarea
              name="message"
              placeholder={errors.message ? errors.message : "Your message"}
              value={formValues.message}
              onChange={handleInputChange}
              className={`${styles.textArea} ${errors.message ? styles.invalid : ""}`}
            ></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;
