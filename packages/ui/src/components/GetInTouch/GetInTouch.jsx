import React, { useState } from 'react';
import styles from './GetInTouch.module.css';
import ContactForm from '../ContactForm/ContactForm';

function GetInTouch() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.circleContainer}>
          <div className={`${styles.circle} ${styles.leftCircle}`}></div>
          <div className={`${styles.circle} ${styles.centerCircle}`}></div>
          <div className={`${styles.circle} ${styles.rightCircle}`}></div>
        </div>
        <h2 className={styles.title}>Still have questions?</h2>
        <p className={styles.description}>
          Can't find the answer you're looking for? Please chat to our friendly team.
        </p>
        <button
          onClick={openModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          className={styles.getInTouchBtn}
        >
          Get in touch
        </button>
      </div>

      {isModalOpen && (
        <div
          className={styles.modalOverlay}
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
          tabIndex={0}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <ContactForm closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default GetInTouch;
