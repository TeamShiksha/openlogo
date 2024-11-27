import React, { useState, useRef } from 'react';
import styles from './ImageUploadModal.module.css';
import { SVGS } from '../../utils/constants';

const ImageUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const inputRef = useRef(null);

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
    if (file && ['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
      const reader = new FileReader();
      reader.onload = (fileRead) => {
        setSelectedImage({
          preview: fileRead.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file (JPG, PNG, or SVG)');
    }
  };

  const handleUpload = () => {
    if (selectedImage) {
      onUpload(selectedImage.file);
      onClose();
    }
  };
  const onCloseModal=()=>{
    onClose();
    setSelectedImage(null);
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${selectedImage?styles.modalWithImage:''}`}>
        <button className={styles.closeButton} onClick={onCloseModal}>×</button>
        
        {!selectedImage ? (
          <div 
            className={`${styles.dropzone} ${dragActive ? styles.dragActive : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={styles.dropzoneContent}>
              <div className={styles.imageIcon}>
                <img src={SVGS.dragAndDropBg}/>
              </div>
              <p>Drop and drop image</p>
              <p>OR</p>
              <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.svg"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <button 
                className={styles.selectButton}
                onClick={() => inputRef.current.click()}
              >
                Select an image
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.previewContainer}>
            <img 
              src={selectedImage.preview} 
              alt="Preview" 
              className={styles.imagePreview}
            />
            <p>{selectedImage.file.name}</p>
            <button 
              className={styles.uploadButton}
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadModal;