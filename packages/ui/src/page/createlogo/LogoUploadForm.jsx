import Modal from "../../components/common/modal/Modal";
import CustomInput from "../../components/common/input/CustomInput";
import Button from "../../components/common/button/Button";
import PropTypes from "prop-types";
import { useApi } from "../../hooks/useApi";
import { useEffect, useState } from "react";
import { useToast } from "../../hooks/useToast";
import styles from "./LogoUploadForm.module.css";
import { validate } from "../../utils/Helpers";
import { BUTTON_TEXT, LOGOUPLOAD, MESSAGES } from "../../utils/Constants";
import axios from "axios";

const LogoUploadForm = ({ closeModal, getCanvasDataUrl }) => {
  const [uploadFormValues, setUploadFormValues] = useState(
    LOGOUPLOAD.initialValues
  );
  const [uploadFormErrors, setUploadFormErrors] = useState({});
  const [isUploadFormValid, setIsUploadFormValid] = useState(false);
  const [activeFormField, setActiveFormField] = useState(null);
  const toast = useToast();

  const { fetchRequest, errorMsg: fetchErrorMsg } = useApi({
    method: "POST",
    url: "create-logo-request/signed-url",
  });

  const { makeRequest: uploadMakeRequest, loading: isMetadataLoading } = useApi(
    {
      method: "POST",
      url: "create-logo-request/logo",
      headers: { "Content-Type": "application/json" },
    }
  );

  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUploadFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  useEffect(() => {
    if (!activeFormField) return;

    const timeId = setTimeout(() => {
      const validationErrors = validate({
        [activeFormField]: uploadFormValues[activeFormField],
      });
      setUploadFormErrors((prevErrors) => ({
        ...prevErrors,
        [activeFormField]: validationErrors[activeFormField],
      }));
    }, 500);

    return () => clearTimeout(timeId);
  }, [activeFormField, uploadFormValues]);

  useEffect(() => {
    const errors = validate(uploadFormValues);
    setIsUploadFormValid(Object.keys(errors).length === 0);
  }, [uploadFormValues]);

  const handleImageUpload = async () => {
    setIsUploading(true);
    try {
      const dataURL = getCanvasDataUrl();
      if (!dataURL) throw new Error("Could not get canvas data");

      let companyName = "logo";
      const match = uploadFormValues.companyUrl.match(
        /:\/\/(?:www\.)?([^./]+)\./i
      );
      if (match) companyName = match[1];

      const response = await fetch(dataURL);
      const blob = await response.blob();
      const file = new File([blob], `${companyName}.png`, {
        type: "image/png",
      });
      const extension = file.name.split(".").pop().toLowerCase();

      const { success, data: uploadResp } = await fetchRequest({
        data: {
          companyUri: uploadFormValues.companyUrl,
          extension,
          type: "upload",
        },
      });

      if (!success || !uploadResp?.data) {
        throw new Error(fetchErrorMsg || "Failed to proceed your request");
      }

      const { presignedUrl, key } = uploadResp.data;
      if (!presignedUrl || !key) {
        throw new Error("Presigned URL or key is missing");
      }

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const metadataSaved = await uploadMakeRequest({
        data: {
          companyUrl: uploadFormValues.companyUrl,
          extension,
          size: file.size,
        },
      });

      if (metadataSaved) {
        toast.success(MESSAGES.IMAGE_UPLOAD_SUCCESS);
        closeModal();
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast.error(error.message || MESSAGES.IMAGE_UPLOAD_ERROR);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    if (isUploadFormValid) {
      handleImageUpload();
    }
  };

  return (
    <Modal onClose={closeModal} isOpen={true}>
      <form onSubmit={handleSubmit} className={styles["logo-upload-form"]}>
        <h3 className={styles["logo-form-title"]}>{LOGOUPLOAD.title}</h3>
        <div className={styles["logo-form-content"]}>
          <CustomInput
            error={uploadFormErrors["companyUrl"]}
            label="Company Url"
            type="text"
            name="companyUrl"
            value={uploadFormValues["companyUrl"]}
            onChange={handleInputChange}
            onFocus={() => setActiveFormField("companyUrl")}
            onBlur={() => setActiveFormField(null)}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          disabled={!isUploadFormValid || isUploading || isMetadataLoading}
          isLoading={isUploading || isMetadataLoading}
        >
          {BUTTON_TEXT.uploadLogo}
        </Button>
      </form>
    </Modal>
  );
};

LogoUploadForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
  getCanvasDataUrl: PropTypes.func.isRequired,
};

export default LogoUploadForm;
