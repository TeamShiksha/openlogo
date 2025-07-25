import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";
import styles from "./ImageUploadModal.module.css";
import {
  BUTTON_TEXT,
  IMAGE_UPLOAD_MODEL,
  MESSAGES,
  SVGS,
} from "../../utils/Constants";
import Modal from "../common/modal/Modal";
import CustomInput from "../common/input/CustomInput";
import Button from "../common/button/Button";

const ImageUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  isUpdate,
  isLoading,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [companyUri, setCompanyUri] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null);
      setCompanyUri("");
    }
  }, [isOpen, setSelectedImage, setCompanyUri]);

  if (!isOpen) return null;

  const handleDrag = (dragEvent) => {
    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    if (dragEvent.type === "dragenter" || dragEvent.type === "dragover") {
      setDragActive(true);
    } else if (dragEvent.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (dropEvent) => {
    dropEvent.preventDefault();
    dropEvent.stopPropagation();
    setDragActive(false);

    const file = dropEvent.dataTransfer.files[0];
    handleFile(file);
  };

  const handleChange = (inputChangeEvent) => {
    const file = inputChangeEvent.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (
      file &&
      ["image/jpeg", "image/png", "image/svg+xml"].includes(file.type)
    ) {
      const reader = new FileReader();
      reader.onload = (fileRead) => {
        setSelectedImage({
          preview: fileRead.target.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert(MESSAGES.UPLOAD_VALID_IMAGE);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (selectedImage) {
      onUpload({ file: selectedImage.file, ...(!isUpdate && { companyUri }) });
    }
  };
  const onCloseModal = () => {
    onClose();
    setSelectedImage(null);
    setCompanyUri("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      size="custom"
      customWidth="500px"
    >
      {!selectedImage ? (
        <div
          className={`${styles.dropzone} ${dragActive ? styles.dragActive : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className={styles.dropzoneContent}>
            <div className={styles.imageIcon}>
              <img src={SVGS.dragAndDropBg} alt="Upload icon" />
            </div>
            <p>{IMAGE_UPLOAD_MODEL.dragAndDropImage}</p>
            <p>{IMAGE_UPLOAD_MODEL.or}</p>
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.svg"
              onChange={handleChange}
              style={{ display: "none" }}
            />
            <Button
              className={styles.selectButton}
              onClick={() => inputRef.current.click()}
            >
              {BUTTON_TEXT.selectAnImage}
            </Button>
          </div>
        </div>
      ) : (
        <form className={styles.previewContainer} onSubmit={handleUpload}>
          <img
            src={selectedImage.preview}
            alt="Preview"
            className={styles.imagePreview}
          />
          <p>{selectedImage.file.name}</p>
          {!isUpdate && (
            <CustomInput
              type="text"
              name="companyUri"
              label="Company URI"
              value={companyUri}
              onChange={(e) => setCompanyUri(e.target.value)}
              className={styles.companyUriInput}
            />
          )}
          <Button
            className={styles.uploadButton}
            isLoading={isLoading}
            onClick={handleUpload}
          >
            {BUTTON_TEXT.upload}
          </Button>
        </form>
      )}
    </Modal>
  );
};

ImageUploadModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpload: PropTypes.func,
  isUpdate: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default ImageUploadModal;
