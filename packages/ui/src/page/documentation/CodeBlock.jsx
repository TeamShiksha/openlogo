import { useState } from "react";
import styles from "./Documentation.module.css";
import PropTypes from "prop-types";
import { codeBlock } from "../../utils/Constants.js";

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
    javascript: codeBlock.jsLogo,
    python: codeBlock.pythonLogo,
    java: codeBlock.javaLogo,
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
              <img src={logos[lang]} alt={`${lang} logo`} />
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
              <img src={codeBlock.tick} alt="tick" />
            ) : (
              <img
                src={codeBlock.copycodeicon}
                alt="Copy code"
                style={{ cursor: "pointer" }}
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
