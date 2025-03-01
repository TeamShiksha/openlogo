import { useState } from "react";
import PropTypes from "prop-types";
import { CODEBLOCK } from "../../utils/Constants";
import styles from "./Documentation.module.css";

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
    javascript: CODEBLOCK.jsLogo,
    python: CODEBLOCK.pythonLogo,
    java: CODEBLOCK.javaLogo,
  };

  return (
    <div className={styles["code-block-wrapper"]}>
      <div className={styles["code-block-header"]}>
        <div className={styles["language-selector"]}>
          {Object.keys(codeExamples).map((lang) => (
            <button
              key={`${id}-${lang}`}
              onClick={() => setSelectedLanguage(lang)}
              className={`${styles["language-button"]} ${
                selectedLanguage === lang
                  ? styles["language-button-active"]
                  : ""
              }`}
            >
              <img src={logos[lang]} alt={`${lang} logo`} />
            </button>
          ))}
        </div>
      </div>
      <pre className={styles["code-block"]}>
        <div className={styles["copy-inside"]}>
          <code>{codeExamples[selectedLanguage]}</code>
          <button
            onClick={() => copyToClipboard(codeExamples[selectedLanguage])}
          >
            {copyMessage ? (
              <img src={CODEBLOCK.tick} alt="tick" />
            ) : (
              <img
                src={CODEBLOCK.copycodeicon}
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
