import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../../hooks/useApi";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../common/loadingspinner/LoadingSpinner.jsx";
import { COPY, API_KEY, BUTTON_TEXT } from "../../../utils/Constants.js";
import { useToast } from "../../../hooks/useToast";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  const { makeRequest, data, errorMsg } = useApi({
    method: "post",
    url: "/users/me/api-key",
    data: {
      key_description: description,
    },
  });

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg);
      setIsGenerating(false);
    }
  }, [errorMsg, toast]);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error(API_KEY.generation.descriptionRequired);
      return;
    }

    setIsGenerating(true);
    const success = await makeRequest();
    if (success) {
      setShowApiKeyModal(true);
      setDescription("");
      toast.success(API_KEY.generation.success);
    }
    setIsGenerating(false);
  };

  const handleCopyKey = () => {
    if (data?.data?.api_key) {
      navigator.clipboard.writeText(data.data.api_key);
      toast.info(API_KEY.copy.success);
    }
  };

  const handleCloseModal = () => {
    setShowApiKeyModal(false);
    if (onKeyGenerated) {
      onKeyGenerated();
    }
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
          disabled={isGenerating}
        />
        <Modal
          isOpen={showApiKeyModal}
          onClose={handleCloseModal}
          customWidth="500px"
        >
          <div className={styles["api-key-modal"]}>
            <h2>{API_KEY.generation.modal.title}</h2>
            <p>{API_KEY.generation.modal.warning}</p>
            <div className={styles["key-display"]}>
              <code>{data?.data?.api_key}</code>
              <div className={styles["icon-wrapper"]}>
                <button
                  type="button"
                  className={styles["icon-button"]}
                  onClick={handleCopyKey}
                  aria-label="Copy API key"
                >
                  <img
                    src={COPY.src}
                    className={styles["copy-icon"]}
                    alt="Copy API key"
                  />
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={isGuest || isGenerating || !description.trim()}
        >
          {isGenerating ? <LoadingSpinner /> : BUTTON_TEXT.generateKey}
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
