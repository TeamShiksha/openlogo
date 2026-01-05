import { useEffect, useRef, useState } from "react";
import {
  Canvas,
  Textbox,
  Rect,
  Circle,
  Triangle,
  Line,
  Group,
  Image as FabricImage,
} from "fabric";
import styles from "./CreateLogo.module.css";
import Button from "../../components/common/button/Button";

export default function CreateLogo() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState("Arial");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 650,
      backgroundColor: "#ffffff",
    });

    canvas.renderAll();
    fabricCanvasRef.current = canvas;

    const handleKeyDown = (e) => {
      if (e.key === "Delete" && canvas.getActiveObject()) {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
          canvas.remove(activeObject);
          canvas.renderAll();
        }
      }
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        const obj = canvas.getActiveObject();
        const text = obj && obj.type === "textbox" ? obj : null;
        if (text) {
          text.set(
            "fontWeight",
            text.fontWeight === "bold" ? "normal" : "bold"
          );
          canvas.renderAll();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  const getActiveText = () => {
    const canvas = fabricCanvasRef.current;
    const obj = canvas?.getActiveObject();
    return obj && obj.type === "textbox" ? obj : null;
  };

  const getActiveObject = () => {
    return fabricCanvasRef.current?.getActiveObject();
  };

  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const text = new Textbox("OpenLogo", {
      left: 450,
      top: 325,
      fontSize: 32,
      fill: "#000000",
      fontFamily: selectedFont,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const changeFontSize = (delta) => {
    const text = getActiveText();
    if (!text) return;
    text.set("fontSize", Math.max(8, text.fontSize + delta));
    fabricCanvasRef.current.renderAll();
  };

  const toggleStyle = (style) => {
    const text = getActiveText();
    if (!text) return;

    if (style === "bold") {
      text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
    }
    if (style === "italic") {
      text.set("fontStyle", text.fontStyle === "italic" ? "normal" : "italic");
    }
    if (style === "underline") {
      text.set("underline", !text.underline);
    }

    fabricCanvasRef.current.renderAll();
  };

  const changeColor = (e) => {
    const obj = getActiveObject();
    if (!obj) return;
    obj.set("fill", e.target.value);
    fabricCanvasRef.current.renderAll();
  };

  const changeFontFamily = (e) => {
    const font = e.target.value;
    setSelectedFont(font);

    const text = getActiveText();
    if (!text) return;

    text.set("fontFamily", font);
    fabricCanvasRef.current.renderAll();
  };

  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const rect = new Rect({
      left: 400,
      top: 275,
      width: 100,
      height: 100,
      fill: "#8b5cf6",
      stroke: "#000000",
      strokeWidth: 2,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const circle = new Circle({
      left: 400,
      top: 275,
      radius: 50,
      fill: "#8b5cf6",
      stroke: "#000000",
      strokeWidth: 2,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  const addTriangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const triangle = new Triangle({
      left: 400,
      top: 275,
      width: 100,
      height: 100,
      fill: "#8b5cf6",
      stroke: "#000000",
      strokeWidth: 2,
    });

    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
  };

  const addLine = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const line = new Line([0, 0, 150, 0], {
      left: 400,
      top: 325,
      stroke: "#000000",
      strokeWidth: 3,
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const addArrow = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const line = new Line([0, 0, 150, 0], {
      stroke: "#000000",
      strokeWidth: 3,
    });

    const triangle = new Triangle({
      left: 150,
      top: -7.5,
      width: 15,
      height: 15,
      fill: "#000000",
      angle: 90,
    });

    const arrow = new Group([line, triangle], {
      left: 400,
      top: 325,
    });

    canvas.add(arrow);
    canvas.setActiveObject(arrow);
    canvas.renderAll();
  };

  const handleImageUpload = (e) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      FabricImage.fromURL(event.target.result).then((img) => {
        img.scale(0.5);
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: "center",
          originY: "center",
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };

    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const duplicateSelected = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      activeObject.clone().then((cloned) => {
        cloned.set({
          left: cloned.left + 20,
          top: cloned.top + 20,
        });
        canvas.add(cloned);
        canvas.setActiveObject(cloned);
        canvas.renderAll();
      });
    }
  };

  const bringToFront = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      canvas.bringObjectToFront(activeObject);
      canvas.renderAll();
    }
  };

  const sendToBack = () => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();

    if (activeObject) {
      canvas.sendObjectToBack(activeObject);
      canvas.renderAll();
    }
  };

  const downloadPNG = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    const link = document.createElement("a");
    link.download = "openlogo.png";
    link.href = dataURL;
    link.click();
  };

  const downloadSVG = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const svg = canvas.toSVG();
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "openlogo.svg";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const json = JSON.stringify(canvas.toJSON());
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.download = "openlogo.json";
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      {/* Top Toolbar - Quick Actions Only */}
      <div className={styles.topToolbar}>
        <div className={styles.toolbarSection}>
          <span className={styles.sectionLabel}>MANAGE</span>
          <Button onClick={duplicateSelected}>Duplicate</Button>
          <Button onClick={deleteSelected}>Delete</Button>
          <Button onClick={bringToFront}>Bring Front</Button>
          <Button onClick={sendToBack}>Send Back</Button>
        </div>

        <div className={styles.toolbarSection}>
          <span className={styles.sectionLabel}>EXPORT</span>
          <Button onClick={downloadPNG}>PNG</Button>
          <Button onClick={downloadSVG}>SVG</Button>
          <Button onClick={downloadJSON}>JSON</Button>
        </div>
      </div>

      <div className={styles.editorLayout}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          {/* Text Controls */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarHeading}>Text</h3>
            <button className={styles.primaryBtn} onClick={addText}>
              Add Text
            </button>

            <label className={styles.label}>Font Family</label>
            <select
              className={styles.select}
              value={selectedFont}
              onChange={changeFontFamily}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>

            <label className={styles.label}>Font Size</label>
            <div className={styles.btnGroup}>
              <button onClick={() => changeFontSize(-2)}>-</button>
              <button onClick={() => changeFontSize(2)}>+</button>
            </div>

            <label className={styles.label}>Style</label>
            <div className={styles.btnGroup}>
              <button onClick={() => toggleStyle("bold")} title="Bold">
                <strong>B</strong>
              </button>
              <button onClick={() => toggleStyle("italic")} title="Italic">
                <em>I</em>
              </button>
              <button
                onClick={() => toggleStyle("underline")}
                title="Underline"
              >
                <u>U</u>
              </button>
            </div>
          </div>

          {/* Shapes */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarHeading}>Shapes</h3>
            <div className={styles.shapeGrid}>
              <button onClick={addRectangle} title="Rectangle">
                □
              </button>
              <button onClick={addCircle} title="Circle">
                ○
              </button>
              <button onClick={addTriangle} title="Triangle">
                △
              </button>
              <button onClick={addLine} title="Line">
                —
              </button>
              <button onClick={addArrow} title="Arrow">
                →
              </button>
            </div>
          </div>

          {/* Color */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarHeading}>Color</h3>
            <input
              type="color"
              onChange={changeColor}
              className={styles.colorPicker}
            />
          </div>

          {/* Upload */}
          <div className={styles.sidebarSection}>
            <h3 className={styles.sidebarHeading}>Upload</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button className={styles.primaryBtn} onClick={triggerImageUpload}>
              📁 Upload Image
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
