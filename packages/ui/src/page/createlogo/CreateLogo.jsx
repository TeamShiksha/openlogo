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
import {
  AArrowUp,
  ArrowUpFromLine,
  ChevronDown,
  CircleChevronLeft,
  Copy,
  Trash,
  Type,
} from "lucide-react";

export default function CreateLogo() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState("Arial");
  const [currentFontSize, setCurrentFontSize] = useState(32);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [exportType, setExportType] = useState("png");

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 650,
      backgroundColor: "#ffffff",
    });
    canvas.renderAll();
    fabricCanvasRef.current = canvas;

    const updateControls = () => {
      const obj = canvas.getActiveObject();
      if (!obj) return;
      setCurrentColor(obj.fill || obj.stroke || "#000000");
      if (obj.type === "textbox") {
        setSelectedFont(obj.fontFamily || "Arial");
        setCurrentFontSize(obj.fontSize || 32);
        setIsBold(obj.fontWeight === "bold");
        setIsItalic(obj.fontStyle === "italic");
        setIsUnderline(!!obj.underline);
      }
    };

    canvas.on("selection:created", updateControls);
    canvas.on("selection:updated", updateControls);

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
      canvas.off("selection:created", updateControls);
      canvas.off("selection:updated", updateControls);
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
      fontSize: currentFontSize,
      fill: currentColor,
      fontFamily: selectedFont,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const changeFontSize = (e) => {
    const size = parseInt(e.target.value);
    setCurrentFontSize(size);
    const text = getActiveText();
    if (!text) return;
    text.set("fontSize", size);
    fabricCanvasRef.current.renderAll();
  };

  const toggleStyle = (style) => {
    const text = getActiveText();
    if (!text) return;
    if (style === "bold") {
      const newVal = text.fontWeight === "bold" ? "normal" : "bold";
      text.set("fontWeight", newVal);
      setIsBold(newVal === "bold");
    } else if (style === "italic") {
      const newVal = text.fontStyle === "italic" ? "normal" : "italic";
      text.set("fontStyle", newVal);
      setIsItalic(newVal === "italic");
    } else if (style === "underline") {
      const newVal = !text.underline;
      text.set("underline", newVal);
      setIsUnderline(newVal);
    }
    fabricCanvasRef.current.renderAll();
  };

  const handleChangeColor = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    const obj = getActiveObject();
    if (!obj) return;
    if (obj.fill !== undefined) obj.set("fill", color);
    if (obj.stroke !== undefined) obj.set("stroke", color);
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
      fill: currentColor,
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
      fill: currentColor,
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
      fill: currentColor,
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
      stroke: currentColor,
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
      stroke: currentColor,
      strokeWidth: 3,
    });
    const triangle = new Triangle({
      left: 150,
      top: -7.5,
      width: 15,
      height: 15,
      fill: currentColor,
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
          <Button onClick={duplicateSelected}>
            <Copy />
          </Button>
          <Button onClick={deleteSelected}>
            <Trash />
          </Button>
          <Button onClick={bringToFront}>
            <AArrowUp />
          </Button>
          <Button onClick={sendToBack}>
            <CircleChevronLeft />
          </Button>
          <div className={styles.toolbarSection}>
            {/* <span className={styles.sectionLabel}>COLOR</span> */}
            <input
              type="color"
              value={currentColor}
              onChange={handleChangeColor}
              className={styles.colorPicker}
            />
          </div>
        </div>

        <div className={styles.toolbarSection}>
          <div>
            <Button>Upload</Button>
          </div>
          <Button
            className={styles.sectionLabel}
            onClick={() => {
              if (exportType === "png") downloadPNG();
              if (exportType === "svg") downloadSVG();
              if (exportType === "json") downloadJSON();
            }}
          >
            EXPORT
          </Button>

          <select
            className={styles.exportSelect}
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <option value="png">PNG</option>
            <option value="svg">SVG</option>
            <option value="json">JSON</option>
          </select>
        </div>
      </div>
      <div className={styles.editorLayout}>
        {/* Left Sidebar */}
        <div className={styles.sidebar}>
          {/* Text Controls */}
          <details open className={styles.sidebarSection}>
            <summary className={styles.sidebarHeading}>
              <span>Text</span>
              <ChevronDown className={styles.chevronIcon} size={16} />
            </summary>
            <Button onClick={addText}>
              <Type />
            </Button>
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
            <select
              className={styles.select}
              value={currentFontSize}
              onChange={changeFontSize}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
              <option value={24}>24</option>
              <option value={32}>32</option>
              <option value={40}>40</option>
              <option value={48}>48</option>
              <option value={64}>64</option>
            </select>
            <div className={styles.btnGroup}>
              <button
                className={isBold ? styles.active : ""}
                onClick={() => toggleStyle("bold")}
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                className={isItalic ? styles.active : ""}
                onClick={() => toggleStyle("italic")}
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                className={isUnderline ? styles.active : ""}
                onClick={() => toggleStyle("underline")}
                title="Underline"
              >
                <u>U</u>
              </button>
            </div>
          </details>
          {/* Shapes */}
          <details open className={styles.sidebarSection}>
            <summary className={styles.sidebarHeading}>
              <span>Shapes</span>
              <ChevronDown className={styles.chevronIcon} size={16} />
            </summary>
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
          </details>
          {/* Upload */}
          <div className={styles.sidebarSection}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button className={styles.primaryBtn} onClick={triggerImageUpload}>
              <ArrowUpFromLine />
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
