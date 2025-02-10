import { useState } from "react";
import jsLogo from "../assets/js.png";
import pythonLogo from "../assets/python.png";
import javaLogo from "../assets/java.png";
import styles from "../page/documentation/Documentation.module.css";
import tick from "../assets/tick.png";
import copycodeicon from "../assets/copy-code-icon.png";
import PropTypes from "prop-types";

const CodeBlock = ({ id, codeExamples }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [copyMessage, setCopyMessage] = useState("");

  const copyToClipboard = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopyMessage("Copied!");
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch(() => {
        setCopyMessage("Copy failed!");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  };

  const logos = {
    javascript: jsLogo,
    python: pythonLogo,
    java: javaLogo,
  };

  return (
    <div className={styles.codeBlockWrapper}>
      <div className={styles.codeBlockHeader}>
        <div className={styles.languageSelector}>
          {Object.keys(codeExamples).map((lang) => (
            <button
              key={`${id}-${lang}`}
              onClick={() => setSelectedLanguage(lang)}
              className={`${styles.languageButton} ${
                selectedLanguage === lang ? styles.languageButtonActive : ""
              }`}
            >
              <img
                src={logos[lang]}
                alt={`${lang} logo`}
                style={{ width: "32px", height: "32px" }}
              />
            </button>
          ))}
        </div>
      </div>
      <pre className={styles.codeBlock}>
        <div className={styles.copyinside}>
          <code>{codeExamples[selectedLanguage]}</code>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
          >
            {copyMessage ? (
              <img
                src={tick}
                alt="tick"
                style={{ width: "24px", height: "24px" }}
              />
            ) : (
              <img
                src={copycodeicon}
                alt="Copy code"
                style={{ width: "24px", height: "24px", cursor: "pointer" }}
              />
            )}
          </button>
        </div>
      </pre>
    </div>
  );
};

CodeBlock.propTypes = {
  id: PropTypes.string.isRequired,
  codeExamples: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default CodeBlock;
