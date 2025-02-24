import { useState, useRef } from "react";
import { FAQ } from "../../utils/Constants";
import PropTypes from "prop-types";
import plusCircle from "../../assets/plusCircle.svg";
import minusCircle from "../../assets/minusCircle.svg";
import styles from "./FAQs.module.css";

const FAQs = () => {
  return (
    <div className={styles["faq-container"]}>
      <h1 className={styles.heading}>{FAQ.TITLE}</h1>
      <div className={styles["faq-list"]}>
        {FAQ["QAS"].map((faq) => (
          <CollapsibleFAQ
            key={faq.question}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </div>
  );
};

const CollapsibleFAQ = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answerRef = useRef(null);
  const toggleFAQ = () => setIsOpen((prev) => !prev);

  return (
    <div className={styles["faq-list"]}>
      <button className={styles["qa-container"]} onClick={toggleFAQ}>
        <h3 className={styles.question}>{question}</h3>
        <img
          src={isOpen ? minusCircle : plusCircle}
          alt={isOpen ? "Collapse FAQ" : "Expand FAQ"}
          className={styles.icon}
        />
      </button>
      <div
        id={`faq-answer-${question}`}
        className={`${styles["answer-container"]} ${isOpen ? styles.open : ""}`}
        ref={answerRef}
        style={{
          maxHeight: isOpen ? `${answerRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <p className={styles.answer}>{answer}</p>
      </div>
    </div>
  );
};

CollapsibleFAQ.propTypes = {
  question: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default FAQs;
