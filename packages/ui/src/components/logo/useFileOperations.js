import { FabricImage } from "fabric";

export const useFileOperations = (fabricCanvasRef, isGuest, toast) => {
  // Define allowed file types and their MIME types
  const ALLOWED_FILE_TYPES = {
    "image/png": "PNG",
    "image/jpeg": "JPEG",
    "image/jpg": "JPG",
    "image/svg+xml": "SVG",
    "image/webp": "WebP",
    "image/bmp": "BMP",
  };

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFile = (file) => {
    // Check if file exists
    if (!file) {
      return { isValid: false, error: "No file selected" };
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES[file.type]) {
      const allowedTypes = Object.values(ALLOWED_FILE_TYPES).join(", ");
      return {
        isValid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes}`,
      };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      return {
        isValid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`,
      };
    }

    return { isValid: true, error: null };
  };

  const handleImageUpload = async (e) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const file = e.target.files[0];

    // Validate file before processing
    const validation = validateFile(file);
    if (!validation.isValid) {
      toast?.error(validation.error);
      e.target.value = null;
      return;
    }

    try {
      const dataURL = await readFileAsDataURL(file);
      const img = await FabricImage.fromURL(dataURL);

      // Additional validation for SVG
      if (file.type === "image/svg+xml") {
        img.scaleToWidth(200);
        // Ensure SVG has proper dimensions
        if (img.width === 0 || img.height === 0) {
          img.scaleToWidth(200);
        }
      } else {
        img.scaleToWidth(200);
      }

      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
        fileType: file.type,
        originalFileName: file.name,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();

      toast?.success(
        `Image uploaded successfully (${ALLOWED_FILE_TYPES[file.type]})`
      );
    } catch (error) {
      console.error("Error loading image:", error);

      // More specific error messages
      let errorMessage = "Failed to load image";
      if (error.message?.includes("security")) {
        errorMessage = "Image contains security restrictions";
      } else if (error.message?.includes("corrupt")) {
        errorMessage = "Image file is corrupted or invalid";
      } else if (file.type === "image/svg+xml") {
        errorMessage = "SVG file could not be parsed";
      }

      toast?.error(errorMessage);
    }

    e.target.value = null;
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  // Export functions (unchanged)
  const exportFunctions = {
    png: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const dataURL = canvas.toDataURL({ format: "png", multiplier: 2 });
      downloadFile(dataURL, "openlogo.png");
    },
    svg: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const svg = canvas.toSVG();
      const blob = new Blob([svg], { type: "image/svg+xml" });
      downloadBlob(blob, "openlogo.svg");
    },
    json: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      const json = JSON.stringify(canvas.toJSON());
      const blob = new Blob([json], { type: "application/json" });
      downloadBlob(blob, "openlogo.json");
    },
  };

  const downloadFile = (dataURL, filename) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = (exportType) => {
    if (isGuest) {
      toast?.error("Guests cannot export logos");
      return;
    }
    exportFunctions[exportType]?.();
  };

  const getCanvasDataUrl = () => {
    const canvas = fabricCanvasRef.current;
    return canvas ? canvas.toDataURL({ format: "png", multiplier: 2 }) : null;
  };

  const getAllowedFileTypes = () => {
    return Object.keys(ALLOWED_FILE_TYPES).join(",");
  };

  return {
    handleImageUpload,
    handleExport,
    getCanvasDataUrl,
    getAllowedFileTypes,
  };
};
