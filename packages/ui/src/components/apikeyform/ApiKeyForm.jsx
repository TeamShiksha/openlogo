import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useApi } from "../../hooks/useApi.js";
import { useToast } from "../../hooks/useToast.js";
import {
  API_KEY,
  BUTTON_TEXT,
  COPY,
  EXPIRY_KEYS_OPTION,
  PUBLISHABLE_KEY,
  TICK,
} from "../../utils/Constants.js";
import { formatDate, validate } from "../../utils/Helpers.js";
import Button from "../common/button/Button.jsx";
import Dropdown from "../common/dropdown/Dropdown.jsx";
import CustomInput from "../common/input/CustomInput.jsx";
import Modal from "../common/modal/Modal.jsx";
import styles from "./ApiKeyForm.module.css";

const originRegex =
  /^https?:\/\/(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?::\d+)?$|^https?:\/\/localhost(?::\d+)?$|^https?:\/\/127\.0\.0\.1(?::\d+)?$/;

const computeActiveOrigins = (
  isPublishable,
  isOriginRestricted,
  origins,
  originInputText
) => {
  if (!isPublishable || !isOriginRestricted) return [];
  const trimmed = originInputText.trim();
  const extra =
    trimmed && !origins.includes(trimmed)
      ? [trimmed.replace(/^,+/, "").replace(/,+$/, "")]
      : [];
  return [...origins, ...extra].filter(Boolean);
};

const resolveOrigins = (currentOrigins, rawInput) => {
  const extra = rawInput.trim().replace(/^,+/, "").replace(/,+$/, "");
  if (!extra) return [...currentOrigins];
  if (currentOrigins.includes(extra)) return null;
  return [...currentOrigins, extra];
};

const getOriginValidationError = (origins, originInputText) => {
  const originsList = resolveOrigins(origins, originInputText);
  const keyErrors = PUBLISHABLE_KEY.generation;

  if (!originsList || new Set(originsList).size !== originsList.length) {
    return keyErrors.duplicateOrigin;
  }
  if (originsList.length === 0) {
    return keyErrors.originRequired;
  }
  if (!originsList.every((o) => originRegex.test(o))) {
    return keyErrors.invalidOrigin;
  }
  return null;
};

const getDescriptionValidationError = (desc, isPub) => {
  const trimmed = desc.trim();
  if (!trimmed) {
    return {
      toastMsg: isPub
        ? PUBLISHABLE_KEY.generation.descriptionRequired
        : API_KEY.generation.descriptionRequired,
    };
  }
  const validationErrors = validate({ description: desc });
  if (validationErrors.description) {
    return { formError: validationErrors.description };
  }
  return null;
};

const validateFieldsOnFocus = (description, isPublishable, activeOrigins) => {
  const validationErrors = validate({ description });
  const errors = { apikey: validationErrors.description || "" };

  if (isPublishable) {
    if (activeOrigins.length === 0) {
      errors.allowedOrigins = PUBLISHABLE_KEY.generation.originRequired;
    } else if (!activeOrigins.every((o) => originRegex.test(o))) {
      errors.allowedOrigins = PUBLISHABLE_KEY.generation.invalidOrigin;
    }
  }

  return errors;
};

const checkFieldValid = (formErrors, description) =>
  Object.values(formErrors).every((error) => !error) ||
  Object.values(description).some((val) => !val);

const checkOriginsValid = (isPublishable, isOriginRestricted, activeOrigins) =>
  !isPublishable ||
  !isOriginRestricted ||
  (activeOrigins.length > 0 && activeOrigins.every((o) => originRegex.test(o)));

function CardHeader({ isPublishable }) {
  return (
    <div className={styles["card-header"]}>
      <div
        className={`${styles["key-icon"]} ${
          isPublishable ? styles["publishable-icon"] : ""
        }`}
      >
        {isPublishable ? (
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
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        ) : (
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
        )}
      </div>
      <h2 className={styles["card-title"]}>
        {isPublishable ? "Generate Publishable Key" : "Generate Key"}
      </h2>
    </div>
  );
}

CardHeader.propTypes = {
  isPublishable: PropTypes.bool.isRequired,
};

function ApiKeyDisplayModal({
  isOpen,
  onClose,
  isPublishable,
  data,
  copyMessage,
  onCopyKey,
}) {
  const keyValue = data?.data?.publishable_key || data?.data?.api_key;
  const expiresAt = data?.data?.expires_at;

  return (
    <Modal isOpen={isOpen} onClose={onClose} customWidth="500px">
      <div className={styles["api-key-modal"]}>
        <h2>
          {isPublishable
            ? PUBLISHABLE_KEY.generation.modal.title
            : API_KEY.generation.modal.title}
        </h2>
        <p>
          {isPublishable
            ? PUBLISHABLE_KEY.generation.modal.warning
            : API_KEY.generation.modal.warning}
        </p>
        <div className={styles["key-display"]}>
          <code>{keyValue}</code>
          <div className={styles["icon-wrapper"]}>
            <button
              type="button"
              className={styles["icon-button"]}
              onClick={onCopyKey}
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

        {expiresAt && (
          <div className={styles["expiry-info"]}>
            <p>
              {isPublishable
                ? PUBLISHABLE_KEY.generation.modal.expiryLabel
                : API_KEY.generation.modal.expiryLabel}{" "}
              {formatDate(expiresAt)}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}

ApiKeyDisplayModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isPublishable: PropTypes.bool.isRequired,
  data: PropTypes.object,
  copyMessage: PropTypes.string,
  onCopyKey: PropTypes.func.isRequired,
};

function ApiKeyForm({ isGuest, onKeyGenerated, keyType = "SECRET" }) {
  const [description, setDescription] = useState("");
  const [origins, setOrigins] = useState([]);
  const [originInputText, setOriginInputText] = useState("");
  const [editingPillIndex, setEditingPillIndex] = useState(null);
  const [editingPillValue, setEditingPillValue] = useState("");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [copyMessage, setCopyMessage] = useState("");
  const [expiresInDays, setExpiresInDays] = useState(365);
  const [isOriginRestricted, setIsOriginRestricted] = useState(true);
  const toast = useToast();

  const isPublishable = keyType === "PUBLISHABLE";

  const activeOrigins = useMemo(
    () =>
      computeActiveOrigins(
        isPublishable,
        isOriginRestricted,
        origins,
        originInputText
      ),
    [isPublishable, isOriginRestricted, origins, originInputText]
  );

  const { makeRequest, data, loading, errorMsg } = useApi({
    method: "post",
    url: "/user/api-key",
    data: {
      key_description: description,
      expires_at: expiresInDays,
      key_type: isPublishable ? "PUBLISHABLE" : "SECRET",
      ...(isPublishable
        ? {
            allowed_origins: isOriginRestricted ? activeOrigins : [],
            is_origin_restricted: isOriginRestricted,
          }
        : {}),
    },
  });

  useEffect(() => {
    if (!["apikey", "originInputs"].includes(focusedField)) {
      setFormErrors({});
      return;
    }
    const timer = setTimeout(() => {
      setFormErrors(
        validateFieldsOnFocus(description, isPublishable, activeOrigins)
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [
    focusedField,
    description,
    activeOrigins,
    origins,
    originInputText,
    isPublishable,
  ]);

  useEffect(() => {
    if (errorMsg) toast.error(errorMsg);
  }, [errorMsg, toast]);

  useEffect(() => {
    if (!copyMessage) return;
    const timeout = setTimeout(() => setCopyMessage(""), 900);
    return () => clearInterval(timeout);
  }, [copyMessage]);

  const addOriginTag = (rawText) => {
    const trimmed = rawText.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) return;
    if (origins.includes(trimmed)) {
      toast.error(PUBLISHABLE_KEY.generation.duplicateOrigin);
      setFormErrors((prev) => ({
        ...prev,
        allowedOrigins: PUBLISHABLE_KEY.generation.duplicateOrigin,
      }));
      return;
    }
    setOrigins((prev) => [...prev, trimmed]);
    setOriginInputText("");
    setFormErrors((prev) => ({ ...prev, allowedOrigins: null }));
  };

  const handleOriginKeyDown = (e) => {
    if (["Enter", ",", " ", "Tab"].includes(e.key)) {
      if (e.key !== "Tab" || originInputText.trim()) {
        e.preventDefault();
        addOriginTag(originInputText);
      }
    } else if (
      e.key === "Backspace" &&
      !originInputText &&
      origins.length > 0
    ) {
      setOrigins((prev) => prev.slice(0, -1));
    }
  };

  const handleOriginBlur = () => {
    if (originInputText.trim()) {
      addOriginTag(originInputText);
    }
    setFocusedField(null);
  };

  const handleRemoveOriginTag = (indexToRemove) => {
    setOrigins((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleStartEditPill = (index, value) => {
    setEditingPillIndex(index);
    setEditingPillValue(value);
  };

  const handleSaveEditPill = (index) => {
    const trimmed = editingPillValue.trim().replace(/^,+|,+$/g, "");
    if (!trimmed) {
      setOrigins((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      if (origins.some((item, idx) => idx !== index && item === trimmed)) {
        toast.error(PUBLISHABLE_KEY.generation.duplicateOrigin);
        setFormErrors((prev) => ({
          ...prev,
          allowedOrigins: PUBLISHABLE_KEY.generation.duplicateOrigin,
        }));
        return;
      }
      setOrigins((prev) =>
        prev.map((item, idx) => (idx === index ? trimmed : item))
      );
      setFormErrors((prev) => ({ ...prev, allowedOrigins: null }));
    }
    setEditingPillIndex(null);
    setEditingPillValue("");
  };

  const handlePillEditKeyDown = (e, index) => {
    if (["Enter", "Tab"].includes(e.key)) {
      e.preventDefault();
      handleSaveEditPill(index);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingPillIndex(null);
      setEditingPillValue("");
    }
  };

  const resetFormState = (isPub) => {
    setShowApiKeyModal(true);
    setDescription("");
    setOrigins([]);
    setOriginInputText("");
    setIsOriginRestricted(true);
    setFormErrors({});
    setFocusedField(null);
    toast.success(
      isPub ? PUBLISHABLE_KEY.generation.success : API_KEY.generation.success
    );
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();

    const descErr = getDescriptionValidationError(description, isPublishable);
    if (descErr) {
      if (descErr.toastMsg) toast.error(descErr.toastMsg);
      if (descErr.formError) setFormErrors({ apikey: descErr.formError });
      return;
    }

    if (isPublishable && isOriginRestricted) {
      const originErr = getOriginValidationError(origins, originInputText);
      if (originErr) {
        toast.error(originErr);
        setFormErrors((prev) => ({ ...prev, allowedOrigins: originErr }));
        return;
      }
    }

    const success = await makeRequest();
    if (success) {
      resetFormState(isPublishable);
    }
  };

  const handleCopyKey = () => {
    const keyToCopy = data?.data?.publishable_key || data?.data?.api_key;
    if (keyToCopy && !copyMessage.trim()) {
      navigator.clipboard.writeText(keyToCopy).then(() => {
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

  const isFieldValid = checkFieldValid(formErrors, description);
  const isValidOrigins = checkOriginsValid(
    isPublishable,
    isOriginRestricted,
    activeOrigins
  );

  return (
    <>
      <CardHeader isPublishable={isPublishable} />

      <p className={styles["card-description"]}>
        {isPublishable
          ? "Create a publishable key for client-side or public application requests."
          : "Create a unique key to authenticate your application requests securely."}
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
            placeholder={
              isPublishable
                ? "e.g., Web App Publishable Key"
                : "e.g., Production API Key"
            }
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            disabled={loading}
            error={formErrors.apikey}
            onFocus={() => setFocusedField("apikey")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {isPublishable && (
          <>
            <div className={styles["form-group"]}>
              <div className={styles["toggle-header"]}>
                <label className={styles["label"]}>Origin Restriction</label>
                <button
                  type="button"
                  role="switch"
                  aria-label="Origin Restriction"
                  aria-checked={isOriginRestricted}
                  className={`${styles["toggle-switch"]} ${
                    isOriginRestricted ? styles["toggle-active"] : ""
                  }`}
                  onClick={() => setIsOriginRestricted(!isOriginRestricted)}
                >
                  <span className={styles["toggle-thumb"]} />
                </button>
              </div>
              <p className={styles["toggle-subtitle"]}>
                {isOriginRestricted
                  ? "Restrict key usage to specified origin domains"
                  : "Allow key usage from any origin domain"}
              </p>
            </div>

            {isOriginRestricted && (
              <div className={styles["form-group"]}>
                <div className={styles["origins-list-header"]}>
                  <label className={styles["label"]}>Allowed Origins</label>
                  <span className={styles["origins-count"]}>
                    {activeOrigins.length}{" "}
                    {activeOrigins.length === 1 ? "origin" : "origins"}
                  </span>
                </div>
                <div className={styles["tag-input-box"]}>
                  {origins.map((origin, index) => (
                    <span key={index} className={styles["origin-pill"]}>
                      {editingPillIndex === index ? (
                        <input
                          type="text"
                          className={styles["pill-edit-input"]}
                          value={editingPillValue}
                          onChange={(e) => setEditingPillValue(e.target.value)}
                          onKeyDown={(e) => handlePillEditKeyDown(e, index)}
                          onBlur={() => handleSaveEditPill(index)}
                          autoFocus
                        />
                      ) : (
                        <>
                          <button
                            type="button"
                            className={styles["pill-text"]}
                            onClick={() => handleStartEditPill(index, origin)}
                            title="Click to edit origin"
                          >
                            {origin}
                          </button>
                          <button
                            type="button"
                            className={styles["pill-remove-btn"]}
                            onClick={() => handleRemoveOriginTag(index)}
                            aria-label={`Remove origin ${origin}`}
                            title="Remove origin"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </>
                      )}
                    </span>
                  ))}
                  <input
                    type="text"
                    name="origin-tag-input"
                    className={styles["tag-input-field"]}
                    placeholder={
                      origins.length === 0
                        ? "e.g., https://example.com or http://localhost:8080"
                        : "Add origin..."
                    }
                    value={originInputText}
                    onChange={(e) => setOriginInputText(e.target.value)}
                    onKeyDown={handleOriginKeyDown}
                    onFocus={() => setFocusedField("originInputs")}
                    onBlur={handleOriginBlur}
                    disabled={loading}
                  />
                </div>

                {formErrors.allowedOrigins && (
                  <p className={styles["error-message"]}>
                    {formErrors.allowedOrigins}
                  </p>
                )}
              </div>
            )}
          </>
        )}

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
          disabled={
            isGuest || !description.trim() || !isFieldValid || !isValidOrigins
          }
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
          {isPublishable
            ? BUTTON_TEXT.generatePublishableKey
            : BUTTON_TEXT.generateKey}
        </Button>

        <ApiKeyDisplayModal
          isOpen={showApiKeyModal}
          onClose={handleCloseModal}
          isPublishable={isPublishable}
          data={data}
          copyMessage={copyMessage}
          onCopyKey={handleCopyKey}
        />
      </form>
    </>
  );
}

ApiKeyForm.propTypes = {
  isGuest: PropTypes.bool.isRequired,
  onKeyGenerated: PropTypes.func.isRequired,
  keyType: PropTypes.oneOf(["SECRET", "PUBLISHABLE"]),
};

export default ApiKeyForm;
