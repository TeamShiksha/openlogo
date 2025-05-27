import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../../hooks/useApi";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../common/loadingspinner/LoadingSpinner.jsx";
import { COPY } from "../../../utils/Constants.js";
import { useToast } from "../../../hooks/useToast";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const toast = useToast();
  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/users/me/api-key",
    data: {
      key_description: description,
    },
  });

  useEffect(() => {
    if (errorMsg) {
      toast.error(errorMsg, "Failed to generate API key");
    }
  }, [errorMsg, toast]);

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    try {
      const success = await makeRequest();
      if (success) {
        setShowApiKeyModal(true);
        setDescription("");
        toast.success("API key generated successfully");
      }
    } catch (err) {
      toast.error("Failed to generate API key");
      console.error("Failed to generate API key:", err);
    }
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(data?.data.api_key);
    toast.info("API key copied to clipboard");
  };

  const handleCloseModal = () => {
    setShowApiKeyModal(false);
    onKeyGenerated();
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
              <code>{data?.data.api_key}</code>
              <div className={styles["icon-wrapper"]}>
                <button
                  type="button"
                  className={styles["icon-button"]}
                  onClick={handleCopyKey}
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
