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
import { validate } from "../../utils/Helpers.js";
import Dropdown from "../common/dropdown/Dropdown.jsx";

function ApiKeyForm({ isGuest, onKeyGenerated }) {
  const [description, setDescription] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(365);
  const toast = useToast();

  const expiryOptions = [
    { value: 7, label: "1 Week" },
    { value: 30, label: "1 Month" },
    { value: 90, label: "3 Months" },
    { value: 180, label: "6 Months" },
    { value: 365, label: "1 Year" },
  ];

  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/user/api-key",
    data: {
      key_description: description,
      expires_at: expiresInDays > 0 ? expiresInDays : null,
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
          error={formErrors.apikey}
          onFocus={() => setFocusedField("apikey")}
          onBlur={() => setFocusedField(null)}
        />

        <div className={styles["expiry-dropdown"]}>
          <label htmlFor="expiry" className={styles["expiry-label"]}>
            Expiry Period
          </label>
          <Dropdown
            options={expiryOptions}
            selectedOption={String(expiresInDays)}
            setSelectedOption={(value) => setExpiresInDays(Number(value))}
            testId="testid-expiry-dropdown"
            className={styles["expiry-select"]}
          />
        </div>
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
                  This key will expire on:{" "}
                  {new Date(data.data.expires_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </Modal>
        <Button
          className={styles.width}
          variant="primary"
          type="submit"
          disabled={isGuest || !description.trim() || !isFieldValid}
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
