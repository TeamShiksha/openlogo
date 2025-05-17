import { useState } from "react";
import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../../hooks/useApi";

function ApiKeyForm({ isGuest }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedKey, setGeneratedKey] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const { makeRequest } = useApi({
    method: "post",
    url: "/users/me/api-key",
    data: {
      key_description: description,
    },
  });
  const handleGenerateKey = async (e) => {
    e.preventDefault();
    try {
      const response = await makeRequest();
      console.log("API Response:", response);
      setGeneratedKey(response.data.key);
      setShowApiKeyModal(true);
      setDescription("");
    } catch (error) {
      console.error("Failed to generate API key:", error);
    }
  };
  // const handleGenerateKey = async (e) => {
  //   e.preventDefault();
  //   const mockKey = "mock_api_key_" + Math.random().toString(36).substring(7);
  //   setGeneratedKey(mockKey);
  //   setShowApiKeyModal(true);
  // }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={description.length === 0 || isGuest}
        >
          Generate Key
        </Button>
      </form>
      <Modal
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        customWidth="500px"
      >
        <div className={styles["api-key-modal"]}>
          <h2>Your API Key</h2>
          <p>
            Please copy your API key now. You won&apos;t be able to see it
            again!
          </p>
          <div className={styles["key-display"]}>
            <code>{generatedKey}</code>
            <Button variant="secondary" onClick={handleCopyKey}>
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

ApiKeyForm.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default ApiKeyForm;
