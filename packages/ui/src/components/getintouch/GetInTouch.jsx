import { useState } from "react";
import Button from "../common/button/Button";
import ContactForm from "./ContactForm";
import styles from "./GetInTouch.module.css";

function GetInTouch() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
          Can&apos;t find the answer you&apos;re looking for? Please chat to our
          friendly team.
        </p>
        <Button
          onClick={openModal}
          variant="primary"
          className={styles.getInTouchBtn}
        >
          Get in touch
        </Button>
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
