import { Image as FabricImage } from "fabric";

export const useFileOperations = (fabricCanvasRef, isGuest, toast) => {
  const handleImageUpload = async (e) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const file = e.target.files[0];
    if (!file) return;

    try {
      const dataURL = await readFileAsDataURL(file);
      const img = await FabricImage.fromURL(dataURL);

      img.scaleToWidth(200);
      img.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    } catch (error) {
      console.error("Error loading image:", error);
      toast?.error("Failed to load image");
    }

    e.target.value = null;
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
    link.click();
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    link.click();
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

  return {
    handleImageUpload,
    handleExport,
    getCanvasDataUrl,
  };
};
