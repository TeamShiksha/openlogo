import CustomInput from "../common/input/CustomInput.jsx";
import Button from "../common/button/Button.jsx";
import Modal from "../common/modal/Modal.jsx";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../hooks/useApi.js";
import { useState, useEffect } from "react";
import {
  COPY,
  TICK,
  API_KEY,
  BUTTON_TEXT,
  API_KEY_FORM,
} from "../../utils/Constants.js";
import { useToast } from "../../hooks/useToast.js";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const toast = useToast();

  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/user/api-key",
    data: {
      key_description: description,
    },
  });

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  useEffect(() => {
    if (!copyMessage) return;
    const timeout = setTimeout(() => setCopyMessage(""), 900);
    return () => clearInterval(timeout);
  }, [copyMessage]);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error(API_KEY.generation.descriptionRequired);
      return;
    }

    const success = await makeRequest();
    if (success) {
      setShowApiKeyModal(true);
      setDescription("");
      toast.success(API_KEY.generation.success);
    }
  };

  const handleCopyKey = () => {
    if (data?.data?.api_key && !copyMessage.trim()) {
      navigator.clipboard.writeText(data.data.api_key).then(() => {
        setCopyMessage("Copied!");
      });
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
        <p className={styles["dashboard-reset-date"]}>{API_KEY_FORM.tagLine}</p>
        <CustomInput
          type="text"
          name="apikey"
          label="Add the description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          disabled={loading}
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
                    src={copyMessage ? TICK.src : COPY.src}
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
          disabled={isGuest || !description.trim()}
          isLoading={loading}
        >
          {BUTTON_TEXT.generateKey}
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
