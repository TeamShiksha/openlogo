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
  EXPIRY_KEYS_OPTION,
} from "../../utils/Constants.js";
import { useToast } from "../../hooks/useToast.js";
import { formatDate, validate } from "../../utils/Helpers.js";
import Dropdown from "../common/dropdown/Dropdown.jsx";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(365);
  const toast = useToast();

  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/user/api-key",
    data: {
      key_description: description,
      expires_at: expiresInDays,
    },
  });

  useEffect(() => {
    if (focusedField !== "apikey") {
      setFormErrors({});
      return;
    }
    const timer = setTimeout(() => {
      const validationErrors = validate({ description });
      setFormErrors({ apikey: validationErrors.description || "" });
    }, 500);
    return () => clearTimeout(timer);
  }, [focusedField, description]);

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
    const validationErrors = validate({ description });
    if (validationErrors.description) {
      setFormErrors({ apikey: validationErrors.description });
      return;
    }
    const success = await makeRequest();
    if (success) {
      setShowApiKeyModal(true);
      setDescription("");
      setFormErrors({});
      setFocusedField(null);
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

  const isFieldValid =
    Object.values(formErrors).every((error) => !error) ||
    Object.values(description).some((val) => !val);

  return (
    <>
      <div className={styles["card-header"]}>
        <div className={styles["key-icon"]}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
          </svg>
        </div>
        <h2 className={styles["card-title"]}>Generate Key</h2>
      </div>

      <p className={styles["card-description"]}>
        Create a unique key to authenticate your application requests securely.
      </p>

      <form
        className={styles["api-key-form"]}
        noValidate
        onSubmit={handleGenerateKey}
      >
        <div className={styles["form-group"]}>
          <label htmlFor="description" className={styles["label"]}>
            Description
          </label>
          <CustomInput
            type="text"
            name="apikey"
            placeholder="e.g., Production API Key"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            disabled={loading}
            error={formErrors.apikey}
            onFocus={() => setFocusedField("apikey")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div className={styles["form-group"]}>
          <label htmlFor="expiry" className={styles["label"]}>
            Expiry Period
          </label>
          <Dropdown
            options={EXPIRY_KEYS_OPTION}
            selectedOption={String(expiresInDays)}
            setSelectedOption={(value) => setExpiresInDays(Number(value))}
            testId="testid-expiry-dropdown"
            className={styles["expiry-dropdown"]}
          />
        </div>

        <Button
          className={styles["submit-btn"]}
          variant="primary"
          type="submit"
          disabled={isGuest || !description.trim() || !isFieldValid}
          isLoading={loading}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-testid="generate-key-btn"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          {BUTTON_TEXT.generateKey}
        </Button>

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

            {data?.data?.expires_at && (
              <div className={styles["expiry-info"]}>
                <p>
                  {API_KEY.generation.modal.expiryLabel}{" "}
                  {formatDate(data.data.expires_at)}
                </p>
              </div>
            )}
          </div>
        </Modal>
      </form>
    </>
  );
}

ApiKeyForm.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  onKeyGenerated: PropTypes.func.isRequired,
};

export default ApiKeyForm;
