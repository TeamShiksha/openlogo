import { useEffect, useRef, useState, useContext } from "react";
import {
  Canvas,
  Textbox,
  Rect,
  Circle,
  Triangle,
  Line,
  // Group,
  Image as FabricImage,
  PencilBrush,
} from "fabric";
import styles from "./CreateLogo.module.css";
import Button from "../../components/common/button/Button";
import {
  AArrowDown,
  AArrowUp,
  ArrowUpFromLine,
  ChevronDown,
  ChevronLeft,
  Copy,
  Menu,
  Pencil,
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [isFilled, setIsFilled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isProcessingRef = useRef(false);
  const isGuest = userData?.role === "GUEST";

  const saveHistory = () => {
    if (isProcessingRef.current || !fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;
    const json = JSON.stringify(canvas.toJSON());

    setHistory((prev) => {
      if (prev[prev.length - 1] === json) return prev;
      return [...prev, json].slice(-40);
    });

    if (!isProcessingRef.current) {
      setRedoStack([]);
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: Math.min(window.innerWidth - 40, 900),
      height: 500,
      backgroundColor: "#ffffff",
      preserveObjectStacking: true,
    });

    const brush = new PencilBrush(canvas);
    brush.color = currentColor;
    brush.width = 5;
    canvas.freeDrawingBrush = brush;

    fabricCanvasRef.current = canvas;

    const initialJson = JSON.stringify(canvas.toJSON());
    setHistory([initialJson]);

    // ─── Event listeners ───────────────────────────────────────
    canvas.on("object:added", saveHistory);
    canvas.on("object:modified", saveHistory);
    canvas.on("object:removed", saveHistory);
    canvas.on("text:changed", saveHistory);

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
    const handleResize = () => {
      if (!fabricCanvasRef.current) return;
      const wrapper = document.querySelector(`.${styles.canvasWrapper}`);
      if (wrapper) {
        const newWidth = Math.min(wrapper.clientWidth - 40, 900);
        fabricCanvasRef.current.setDimensions({
          width: newWidth,
          height: window.innerWidth < 768 ? 400 : 650,
        });
        fabricCanvasRef.current.renderAll();
        saveHistory();
      }
    };

    window.addEventListener("resize", handleResize);

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

      window.removeEventListener("resize", handleResize);
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1025px)");
    setSidebarOpen(mediaQuery.matches);

    const handler = (e) => setSidebarOpen(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
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

    const { x, y } = getCanvasCenter();

    const text = new Textbox("New text", {
      left: x - 80,
      top: y - 20,
      originX: "center",
      originY: "center",
      fontSize: currentFontSize,
      width: 130,
      fill: currentColor,
      fontFamily: selectedFont,
      fontWeight: isBold ? "bold" : "normal",
      fontStyle: isItalic ? "italic" : "normal",
      underline: isUnderline,
    });

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    saveHistory();
  };

  const changeFontFamily = (e) => {
    const font = e.target.value;
    setSelectedFont(font);
    const text = getActiveText();
    if (text) {
      text.set("fontFamily", font);
      fabricCanvasRef.current.renderAll();
      saveHistory();
    }
  };

  const resetCanvas = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (window.confirm("Are you sure you want to clear the entire canvas?")) {
      canvas.clear();
      canvas.backgroundColor = "#ffffff";

      // Reset History
      const initialJson = JSON.stringify(canvas.toJSON());
      setHistory([initialJson]);
      setRedoStack([]);
      canvas.renderAll();
      toast?.success("Canvas cleared");
    }
  };

  // Function to update brush properties
  const updateBrush = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;

    canvas.freeDrawingBrush.color = currentColor;
    canvas.freeDrawingBrush.width = brushSize;
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const newMode = !isDrawing;
    setIsDrawing(newMode);
    canvas.isDrawingMode = newMode;

    if (newMode) {
      updateBrush();
    }
  };
  useEffect(() => {
    if (isDrawing) {
      updateBrush();
    }
  }, [currentColor, brushSize, isDrawing]);

  const changeFontSize = (e) => {
    const size = parseInt(e.target.value, 10);
    setCurrentFontSize(size);
    const text = getActiveText();
    if (text) {
      text.set("fontSize", size);
      fabricCanvasRef.current.renderAll();
      saveHistory();
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
    saveHistory();
  };

  // === Color ===
  const handleChangeColor = (e) => {
    const color = e.target.value;
    if (!color || color === "transparent") return;

    setCurrentColor(color);
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }

    const obj = getActiveObject();
    if (!obj) return;

    if (obj.type === "path") {
      obj.set("stroke", color);
    } else {
      if (isFilled) {
        obj.set({ fill: color, stroke: color, strokeWidth: 1 });
      } else {
        obj.set({ fill: "transparent", stroke: color, strokeWidth: 4 });
      }
    }

    canvas.renderAll();
    saveHistory();
  };

  // === Shapes ===
  // Add these near your other helpers
  const getCanvasCenter = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return { x: 150, y: 150 }; // fallback

    return {
      x: canvas.getWidth() / 2,
      y: canvas.getHeight() / 2,
    };
  };

  const addRectangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCenter();

    const rect = new Rect({
      left: x - 75,
      top: y - 50,
      originX: "center",
      originY: "center",
      width: 150,
      height: 100,
      fill: isFilled ? currentColor : "transparent",
      stroke: currentColor,
      strokeWidth: isFilled ? 1 : 4,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
  };

  // Circle
  const addCircle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCenter();

    const circle = new Circle({
      left: x,
      top: y,
      originX: "center",
      originY: "center",
      radius: 60, // smaller on mobile is better — or make dynamic
      fill: isFilled ? currentColor : "transparent",
      stroke: currentColor,
      strokeWidth: isFilled ? 1 : 4,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
  };

  // Triangle (similar pattern)
  const addTriangle = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCenter();

    const tri = new Triangle({
      left: x,
      top: y,
      originX: "center",
      originY: "center",
      width: 120,
      height: 100,
      fill: isFilled ? currentColor : "transparent",
      stroke: currentColor,
      strokeWidth: isFilled ? 1 : 4,
    });

    canvas.add(tri);
    canvas.setActiveObject(tri);
    canvas.renderAll();
  };

  // Line
  const addLine = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCenter();

    const line = new Line([x - 100, y, x + 100, y], {
      stroke: currentColor,
      strokeWidth: 4,
    });

    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
  };

  // const addArrow = () => {
  //   const canvas = fabricCanvasRef.current;
  //   if (!canvas) return;

  //   const line = new Line([0, 0, 180, 0], {
  //     stroke: currentColor,
  //     strokeWidth: 5,
  //   });

  //   const head = new Triangle({
  //     width: 25,
  //     height: 35,
  //     fill: currentColor,
  //     left: 180,
  //     top: -17.5,
  //     angle: 90,
  //   });

  //   const arrow = new Group([line, head], {
  //     left: 300,
  //     top: 250,
  //   });

  //   canvas.add(arrow);
  //   canvas.setActiveObject(arrow);
  //   canvas.renderAll();
  // };

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
    };
    reader.readAsDataURL(file);

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
    if (!canvas) return;

    const activeObjects = canvas.getActiveObjects();

    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.requestRenderAll();
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

  const undo = async () => {
    if (isProcessingRef.current) return;
    if (history.length <= 1) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    isProcessingRef.current = true;

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    // Add current state to redo stack
    setRedoStack((prev) => [...prev, current]);

    // Remove last state from history
    setHistory((prev) => prev.slice(0, -1));

    // Load previous state
    await canvas.loadFromJSON(previous);
    canvas.renderAll();

    isProcessingRef.current = false;
  };

  const redo = async () => {
    if (isProcessingRef.current) return;
    if (redoStack.length === 0) return;

    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    isProcessingRef.current = true;

    // Get the next state from redo stack
    const nextState = redoStack[redoStack.length - 1];

    // Remove it from redo stack
    setRedoStack((prev) => prev.slice(0, -1));

    // Add current state to history
    setHistory((prev) => [...prev, nextState]);

    // Load the next state
    await canvas.loadFromJSON(nextState);
    canvas.renderAll();

    isProcessingRef.current = false;
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
          <div className={styles.toolbarMidSection}>
            <Button
              onClick={() => {
                setSidebarOpen((prev) => !prev);
                setTimeout(
                  () => window.dispatchEvent(new Event("resize")),
                  400
                );
              }}
              title="Toggle sidebar"
            >
              {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
            </Button>
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
            <Button onClick={resetCanvas} title="Reset Canvas">
              <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                RESET
              </span>
            </Button>
            <input
              type="color"
              value={currentColor}
              onChange={handleChangeColor}
              className={styles.colorPicker}
              title="Color"
            />

            <Button
              onClick={triggerImageUpload}
              title="Upload"
              className={styles.primaryBtn}
            >
              Upload
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
      </div>

      <div className={styles.editorLayout}>
        {/* Sidebar */}
        <aside
          className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}
        >
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

            <div className={styles.sectionContent}>
              {/* Fill/Outline Toggle */}
              <div className={styles.btnGroup} style={{ marginBottom: "10px" }}>
                <Button
                  className={isFilled ? styles.active : ""}
                  onClick={() => setIsFilled(true)}
                >
                  Fill
                </Button>
                <Button
                  className={!isFilled ? styles.active : ""}
                  onClick={() => setIsFilled(false)}
                >
                  Outline
                </Button>
              </div>

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
                {/* <Button onClick={addArrow} title="Arrow">
                  →
                </Button> */}
              </div>
            </div>
          </details>
          <details open className={styles.sidebarSection}>
            <summary className={styles.sidebarHeading}>
              <span>Draw</span>
              <ChevronDown className={styles.chevronIcon} />
            </summary>
            <div className={styles.sectionContent}>
              <div className={styles.drawControls}>
                <Button
                  className={isDrawing ? styles.active : ""}
                  onClick={toggleDrawingMode}
                  title="Pen Tool"
                >
                  <Pencil size={20} />
                </Button>

                <div
                  className={styles.sliderWrapper}
                  style={{ marginTop: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "5px",
                    }}
                  >
                    <label style={{ fontSize: "12px", color: "#666" }}>
                      Brush Size
                    </label>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      {brushSize}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
                    style={{ width: "100%", cursor: "pointer" }}
                  />
                </div>
              </div>
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
              title="Import Image"
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
