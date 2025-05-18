import CustomInput from "../../common/input/CustomInput";
import Button from "../../common/button/Button";
import Modal from "../../common/modal/Modal";
import styles from "./ApiKeyForm.module.css";
import PropTypes from "prop-types";
import { useApi } from "../../../hooks/useApi";
import { useContext, useState } from "react";
import LoadingSpinner from "../../common/loadingspinner/LoadingSpinner.jsx";
import { UserContext } from "../../../contexts/Contexts.jsx";

function ApiKeyForm({ isGuest }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { fetchUserData } = useContext(UserContext);

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
    fetchUserData();
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
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={isGuest || loading}
        >
          {loading ? <LoadingSpinner /> : "Generate Key"}
        </Button>
      </form>
      <Modal
        isOpen={showApiKeyModal}
        onClose={handleCloseModal}
        customWidth="500px"
      >
        <div className={styles["api-key-modal"]}>
          {errorMsg ? (
            <>
              <h2>Error</h2>
              <p className={styles["error-message"]}>{errorMsg}</p>
            </>
          ) : (
            <>
              <h2>Your API Key</h2>
              <p>
                Please copy your API key now. You won&apos;t be able to see it
                again!
              </p>
              <div className={styles["key-display"]}>
                <code>{data?.data.api_key}</code>
                <Button variant="secondary" onClick={handleCopyKey}>
                  {isCopied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </section>
  );
}

ApiKeyForm.propTypes = {
  isGuest: PropTypes.bool.isRequired,
};

export default ApiKeyForm;
