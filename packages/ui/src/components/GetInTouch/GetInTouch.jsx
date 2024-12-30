import React, { useState } from "react";
import styles from "./GetInTouch.module.css";
import ContactForm from "../ContactForm/ContactForm";

function GetInTouch() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.circleContainer}>
          <div className={`${styles.circle} ${styles.leftCircle}`} />
          <div className={`${styles.circle} ${styles.centerCircle}`} />
          <div className={`${styles.circle} ${styles.rightCircle}`} />
        </div>
        <h2 className={styles.title}>Still have questions?</h2>
        <p className={styles.description}>
          Can't find the answer you're looking for? Please chat to our friendly
          team.
        </p>
        <button
          onClick={openModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className={styles.getInTouchBtn}
        >
          Get in touch
        </button>
      </div>

      {isModalOpen && (
        <dialog
          className={styles.modalOverlay}
          open={isModalOpen}
          onClose={closeModal}
        >
          <div className={styles.modalContent}>
            <ContactForm closeModal={closeModal} />
          </div>
        </dialog>
      )}
    </div>
  );
}

export default GetInTouch;
