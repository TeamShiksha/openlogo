import { useEffect, useRef, useState, useContext } from "react";
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
  AArrowDown,
  AArrowUp,
  ArrowUpFromLine,
  ChevronDown,
  // CircleChevronLeft,
  // CircleChevronRight,
  Copy,
  Redo,
  Trash,
  Type,
  Undo,
} from "lucide-react";
import { UserContext } from "../../contexts/Contexts.jsx";
import { useToast } from "../../hooks/useToast.js";

export default function CreateLogo() {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { userData } = useContext(UserContext);
  const toast = useToast();

  const [selectedFont, setSelectedFont] = useState("Arial");
  const [currentFontSize, setCurrentFontSize] = useState(32);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [exportType, setExportType] = useState("png");
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const isProcessingRef = useRef(false);
  const isGuest = userData?.role === "GUEST";

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new Canvas(canvasRef.current, {
      width: 900,
      height: 650,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true, // better z-index behavior
    });

    fabricCanvasRef.current = canvas;

    // Flag to prevent history from being saved during undo/redo
    const saveHistory = () => {
      if (isProcessingRef.current) return;

      const json = JSON.stringify(
        canvas.toJSON([
          "fontFamily",
          "fontSize",
          "fontWeight",
          "fontStyle",
          "underline",
          "stroke",
          "strokeWidth",
          "fill",
          "opacity",
        ])
      );

      setHistory((prev) => {
        const newHistory = [...prev, json];
        // Optional: limit history size to prevent memory issues
        if (newHistory.length > 40) newHistory.shift();
        return newHistory;
      });

      setRedoStack([]); // New action → clear redo stack
    };

    // Save initial empty state
    const initialJson = JSON.stringify(canvas.toJSON());
    setHistory([initialJson]);

    // ─── Event listeners ───────────────────────────────────────
    canvas.on("object:added", saveHistory);
    canvas.on("object:modified", saveHistory);
    canvas.on("object:removed", saveHistory);
    // These are very useful for a smooth experience:
    canvas.on("object:scaling", saveHistory);
    canvas.on("object:rotating", saveHistory);
    canvas.on("object:moving", saveHistory);

    // ─── Selection sync with controls ──────────────────────────
    const updateControls = () => {
      const obj = canvas.getActiveObject();
      if (!obj) {
        setCurrentColor("#000000");
        setSelectedFont("Arial");
        setCurrentFontSize(32);
        setIsBold(false);
        setIsItalic(false);
        setIsUnderline(false);
        return;
      }

      setCurrentColor((obj.fill || obj.stroke || "#000000").toString());

      if (obj.type === "textbox") {
        setSelectedFont(obj.fontFamily || "Arial");
        setCurrentFontSize(obj.fontSize || 32);
        setIsBold(obj.fontWeight === "bold" || obj.fontWeight === 700);
        setIsItalic(obj.fontStyle === "italic");
        setIsUnderline(!!obj.underline);
      }
    };

    canvas.on("selection:created", updateControls);
    canvas.on("selection:updated", updateControls);
    canvas.on("selection:cleared", updateControls);

    // ─── Keyboard shortcuts ────────────────────────────────────
    const handleKeyDown = (e) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObj = canvas.getActiveObject();
        if (activeObj && !activeObj.isEditing) {
          e.preventDefault();
          deleteSelected();
        }
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "z":
            e.preventDefault();
            undo();
            break;
          case "y":
            e.preventDefault();
            redo();
            break;
          case "d":
            e.preventDefault();
            duplicateSelected();
            break;
          case "b":
            e.preventDefault();
            toggleStyle("bold");
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // ─── Cleanup ───────────────────────────────────────────────
    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      canvas.off("object:added", saveHistory);
      canvas.off("object:modified", saveHistory);
      canvas.off("object:removed", saveHistory);
      canvas.off("object:scaling", saveHistory);
      canvas.off("object:rotating", saveHistory);
      canvas.off("object:moving", saveHistory);

      canvas.off("selection:created", updateControls);
      canvas.off("selection:updated", updateControls);
      canvas.off("selection:cleared", updateControls);

      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  const getActiveObject = () => fabricCanvasRef.current?.getActiveObject();
  const getActiveText = () => {
    const obj = getActiveObject();
    return obj && obj.type === "textbox" ? obj : null;
  };

  // === Text Controls ===
  const addText = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const text = new Textbox("OpenLogo", {
      left: 300,
      top: 200,
      fontSize: currentFontSize,
      fill: currentColor,
      fontFamily: selectedFont,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const changeFontFamily = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    const text = getActiveText();
    if (text) {
      text.set("fontFamily", font);
      fabricCanvasRef.current.renderAll();
    }
  };

  const changeFontSize = (e) => {
    const size = parseInt(e.target.value, 10);
    setCurrentFontSize(size);
    const text = getActiveText();
    if (text) {
      text.set("fontSize", size);
      fabricCanvasRef.current.renderAll();
    }
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

  // === Color ===
  const handleChangeColor = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
    const obj = getActiveObject();
    if (!obj) return;
    if (obj.fill !== undefined) obj.set("fill", color);
    if (obj.stroke !== undefined) obj.set("stroke", color);
    fabricCanvasRef.current.renderAll();
  };

  // === Shapes ===
  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const rect = new Rect({
      left: 300,
      top: 200,
      width: 150,
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
      left: 300,
      top: 200,
      radius: 75,
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
      left: 300,
      top: 200,
      width: 150,
      height: 150,
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
    const line = new Line([0, 0, 200, 0], {
      left: 300,
      top: 250,
      stroke: currentColor,
      strokeWidth: 5,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  const addArrow = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const line = new Line([0, 0, 180, 0], {
      stroke: currentColor,
      strokeWidth: 5,
    });

    const head = new Triangle({
      width: 25,
      height: 35,
      fill: currentColor,
      left: 180,
      top: -17.5,
      angle: 90,
    });

    const arrow = new Group([line, head], {
      left: 300,
      top: 250,
    });

    canvas.add(arrow);
    canvas.setActiveObject(arrow);
    canvas.renderAll();
  };

  // === Image Upload ===
  const handleImageUpload = async (e) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataURL = event.target.result;

      try {
        // In Fabric 6.x, fromURL returns a Promise
        const img = await FabricImage.fromURL(dataURL);

        // Scale and position
        img.scaleToWidth(200); // Helper to scale by width
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
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be uploaded again if deleted
    e.target.value = null;
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // === Object Management ===
  const duplicateSelected = () => {
    const canvas = fabricCanvasRef.current;
    const obj = getActiveObject();
    if (!obj) return;

    obj.clone((cloned) => {
      cloned.set({
        left: cloned.left + 30,
        top: cloned.top + 30,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
    });
  };

  const deleteSelected = () => {
    const canvas = fabricCanvasRef.current;
    const obj = getActiveObject();
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
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

  // Save state to history
  // const saveHistory = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;

  //   const json = JSON.stringify(canvas.toJSON());
  //   setHistory((prev) => [...prev, json]);
  //   setRedoStack([]); // Clear redo stack on new action
  // };

  const undo = () => {
    if (history.length <= 1) return; // keep initial state

    const current = JSON.stringify(fabricCanvasRef.current.toJSON());
    const previous = history[history.length - 2];

    setRedoStack((prev) => [...prev, current]);
    setHistory((prev) => prev.slice(0, -1));

    isProcessingRef.current = true;
    fabricCanvasRef.current.loadFromJSON(previous, () => {
      fabricCanvasRef.current.renderAll();
      isProcessingRef.current = false;
    });
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const nextState = redoStack[redoStack.length - 1];

    const current = JSON.stringify(fabricCanvasRef.current.toJSON());
    setHistory((prev) => [...prev, current]);
    setRedoStack((prev) => prev.slice(0, -1));

    isProcessingRef.current = true;
    fabricCanvasRef.current.loadFromJSON(nextState, () => {
      fabricCanvasRef.current.renderAll();
      isProcessingRef.current = false;
    });
  };

  // === Export ===
  const downloadPNG = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: "png",
      multiplier: 2,
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

  const handleExport = () => {
    if (isGuest) {
      toast?.error("Guests cannot export logos");
      return;
    }
    if (exportType === "png") downloadPNG();
    if (exportType === "svg") downloadSVG();
    if (exportType === "json") downloadJSON();
  };

  return (
    <div className={styles.container}>
      {/* Top Toolbar */}
      <div className={styles.topToolbar}>
        <div className={styles.toolbarSection}>
          <span className={styles.sectionLabel}>MANAGE</span>
          <Button onClick={duplicateSelected} title="Duplicate (Ctrl+D)">
            <Copy size={18} />
          </Button>
          <Button onClick={deleteSelected} title="Delete (Del)">
            <Trash size={18} />
          </Button>
          <Button onClick={bringToFront} title="Bring to Front">
            <AArrowUp size={18} />
          </Button>
          <Button onClick={sendToBack} title="Send to Back">
            <AArrowDown size={18} />
          </Button>
          <Button onClick={undo} title="Undo">
            <Undo size={18} />
          </Button>
          <Button onClick={redo} title="Redo">
            <Redo size={18} />
          </Button>
          <input
            type="color"
            value={currentColor}
            onChange={handleChangeColor}
            className={styles.colorPicker}
            title="Color"
          />
        </div>

        <div className={styles.toolbarSection}>
          <Button
            onClick={triggerImageUpload}
            title="Upload Image"
            className={styles.primaryBtn}
          >
            Upload Image
          </Button>
          <Button
            onClick={handleExport}
            title="Export"
            className={styles.primaryBtn}
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
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <details open className={styles.sidebarSection}>
            <summary className={styles.sidebarHeading}>
              <span>Text</span>
              <ChevronDown className={styles.chevronIcon} />
            </summary>

            <div className={styles.sectionContent}>
              <Button onClick={addText} title="Add Text">
                <Type size={20} />
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
                {[8, 12, 16, 24, 32, 40, 48, 64].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <div className={styles.btnGroup}>
                <Button
                  className={isBold ? styles.active : ""}
                  onClick={() => toggleStyle("bold")}
                >
                  B
                </Button>
                <Button
                  className={isItalic ? styles.active : ""}
                  onClick={() => toggleStyle("italic")}
                >
                  I
                </Button>
                <Button
                  className={isUnderline ? styles.active : ""}
                  onClick={() => toggleStyle("underline")}
                >
                  U
                </Button>
              </div>
            </div>
          </details>

          <details open className={styles.sidebarSection}>
            <summary className={styles.sidebarHeading}>
              <span>Shapes</span>
              <ChevronDown className={styles.chevronIcon} />
            </summary>
            <div className={styles.shapeGrid}>
              <Button onClick={addRectangle} title="Rectangle">
                □
              </Button>
              <Button onClick={addCircle} title="Circle">
                ○
              </Button>
              <Button onClick={addTriangle} title="Triangle">
                △
              </Button>
              <Button onClick={addLine} title="Line">
                —
              </Button>
              <Button onClick={addArrow} title="Arrow">
                →
              </Button>
            </div>
          </details>

          <div className={styles.sidebarSection}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Button
              className={styles.primaryBtn}
              onClick={triggerImageUpload}
              title="Upload Image"
            >
              <ArrowUpFromLine />
            </Button>
          </div>
        </aside>

        {/* Canvas */}
        <div className={styles.canvasWrapper}>
          <canvas ref={canvasRef} />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
    </div>
  );
}
