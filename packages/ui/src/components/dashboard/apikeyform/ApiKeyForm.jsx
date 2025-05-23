import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../../hooks/useApi";
import { useState } from "react";
import LoadingSpinner from "../../common/loadingspinner/LoadingSpinner.jsx";
import { COPY, VISIBLE, VISIBLEOFF } from "../../../utils/Constants.js";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/users/me/api-key",
    data: {
      key_description: description,
    },
  });

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    try {
      await makeRequest();
      setShowApiKeyModal(true);
      setDescription("");
      onKeyGenerated();
    } catch (error) {
      console.error("Failed to generate API key:", error);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(data?.data.api_key);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCloseModal = () => {
    setShowApiKeyModal(false);
  };

  return (
    <section className={styles["dashboard-content-section"]}>
      <form
        className={styles["api-key-container"]}
        noValidate
        onSubmit={handleGenerateKey}
      >
        <p className={styles["dashboard-reset-date"]}>
          Generate a new API key to use in your projects.
        </p>
        <CustomInput
          type="text"
          name="apikey"
          label="Add the description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        {errorMsg ? (
          <>
            <p className={styles["error-message"]}>{errorMsg}</p>
          </>
        ) : (
          <Modal
            isOpen={showApiKeyModal}
            onClose={handleCloseModal}
            customWidth="500px"
          >
            <div className={styles["api-key-modal"]}>
              <h2>Your API Key</h2>
              <p>
                Please copy your API key now. You won&apos;t be able to see it
                again!
              </p>
              <div className={styles["key-display"]}>
                <code>
                  {isVisible
                    ? data?.data.api_key
                    : "********************************"}
                </code>
                <div className={styles["copy-wrapper"]}>
                  <img
                    src={isVisible ? VISIBLE.src : VISIBLEOFF.src}
                    className={styles["copy-icon"]}
                    onClick={() => setIsVisible(!isVisible)}
                    alt={isVisible ? VISIBLE.alt : VISIBLEOFF.alt}
                  />
                  <img
                    src={COPY.src}
                    className={styles["copy-icon"]}
                    onClick={handleCopyKey}
                    alt="Copy API key"
                  />
                  {isCopied && <div className={styles["tooltip"]}>Copied!</div>}
                </div>
              </div>
            </div>
          </Modal>
        )}
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={isGuest || loading}
        >
          {loading ? <LoadingSpinner /> : "Generate Key"}
        </Button>
      </form>
    </section>
  );
}

ApiKeyForm.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  onKeyGenerated: PropTypes.func.isRequired,
};

export default ApiKeyForm;
