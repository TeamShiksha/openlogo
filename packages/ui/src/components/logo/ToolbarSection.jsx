import {
  ChevronDown,
  Type,
  Pencil,
  ArrowUpFromLine,
  Minus,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  Square as SquareIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
} from "lucide-react";
import Button from "../../components/common/button/Button";
import styles from "./ToolbarSection.module.css";
import PropTypes from "prop-types";

const TextSection = ({ config, handlers, activeTool }) => (
  <details open className={styles.sidebarSection}>
    <summary className={styles.sidebarHeading}>
      <span>Text</span>
      <ChevronDown className={styles.chevronIcon} />
    </summary>
    <div className={styles.sectionContent}>
      <Button
        onClick={handlers.addText}
        title="Add Text"
        className={activeTool === "text" ? styles.active : ""}
      >
        <Type size={20} />
      </Button>
      <select
        className={styles.select}
        value={config.font}
        onChange={handlers.changeFont}
      >
        {[
          "Arial",
          "Helvetica",
          "Times New Roman",
          "Courier New",
          "Georgia",
          "Verdana",
        ].map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
      </select>
      <select
        className={styles.select}
        value={config.fontSize}
        onChange={handlers.changeSize}
      >
        {[8, 12, 16, 24, 32, 40, 48, 64].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <div className={styles.btnGroup}>
        <Button
          className={config.bold ? styles.active : ""}
          onClick={() => handlers.toggleStyle("bold")}
          title="Bold"
        >
          <Bold size={16} />
        </Button>
        <Button
          className={config.italic ? styles.active : ""}
          onClick={() => handlers.toggleStyle("italic")}
          title="Italic"
        >
          <Italic size={16} />
        </Button>
        <Button
          className={config.underline ? styles.active : ""}
          onClick={() => handlers.toggleStyle("underline")}
          title="Underline"
        >
          <Underline size={16} />
        </Button>
      </div>
    </div>
  </details>
);

TextSection.propTypes = {
  config: PropTypes.shape({
    font: PropTypes.string.isRequired,
    fontSize: PropTypes.number.isRequired,
    bold: PropTypes.bool.isRequired,
    italic: PropTypes.bool.isRequired,
    underline: PropTypes.bool.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    addText: PropTypes.func.isRequired,
    changeFont: PropTypes.func.isRequired,
    changeSize: PropTypes.func.isRequired,
    toggleStyle: PropTypes.func.isRequired,
  }).isRequired,
  activeTool: PropTypes.string,
};

const ShapeSection = ({ config, handlers }) => (
  <details open className={styles.sidebarSection}>
    <summary className={styles.sidebarHeading}>
      <span>Shapes</span>
      <ChevronDown className={styles.chevronIcon} />
    </summary>
    <div className={styles.sectionContent}>
      <div className={styles.btnGroup} style={{ marginBottom: "10px" }}>
        <Button
          className={config.isFilled ? styles.active : ""}
          onClick={() => handlers.setFilled(true)}
          title="Fill"
        >
          Fill
        </Button>
        <Button
          className={!config.isFilled ? styles.active : ""}
          onClick={() => handlers.setFilled(false)}
          title="Outline"
        >
          Outline
        </Button>
      </div>
      <div className={styles.shapeGrid}>
        {[
          {
            type: "rectangle",
            icon: <SquareIcon size={18} />,
            title: "Rectangle",
          },
          { type: "circle", icon: <CircleIcon size={18} />, title: "Circle" },
          {
            type: "triangle",
            icon: <TriangleIcon size={18} />,
            title: "Triangle",
          },
          { type: "line", icon: <Minus size={18} />, title: "Line" },
          { type: "arrow", icon: <ArrowRight size={18} />, title: "Arrow" },
        ].map((shape) => (
          <Button
            key={shape.type}
            onClick={() => handlers.addShape(shape.type)}
            title={shape.title}
          >
            {shape.icon}
          </Button>
        ))}
      </div>
    </div>
  </details>
);

ShapeSection.propTypes = {
  config: PropTypes.shape({
    isFilled: PropTypes.bool.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    setFilled: PropTypes.func.isRequired,
    addShape: PropTypes.func.isRequired,
  }).isRequired,
};

const DrawSection = ({ config, handlers }) => (
  <details open className={styles.sidebarSection}>
    <summary className={styles.sidebarHeading}>
      <span>Draw</span>
      <ChevronDown className={styles.chevronIcon} />
    </summary>
    <div className={styles.sectionContent}>
      <Button
        className={config.isDrawing ? styles.active : ""}
        onClick={handlers.toggleDrawing}
        title="Pen Tool"
      >
        <Pencil size={20} />
      </Button>
      <div className={styles.sliderWrapper} style={{ marginTop: "15px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <label style={{ fontSize: "12px", color: "#666" }}>Brush Size</label>
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>
            {config.brushSize}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={config.brushSize}
          onChange={(e) => handlers.setBrushSize(parseInt(e.target.value, 10))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>
    </div>
  </details>
);

DrawSection.propTypes = {
  config: PropTypes.shape({
    isDrawing: PropTypes.bool.isRequired,
    brushSize: PropTypes.number.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    toggleDrawing: PropTypes.func.isRequired,
    setBrushSize: PropTypes.func.isRequired,
  }).isRequired,
  activeTool: PropTypes.string,
};

// Update main component to accept activeTool prop
export default function ToolbarSection({
  sidebarOpen,
  config,
  handlers,
  activeTool,
}) {
  return (
    <aside
      className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}
    >
      <TextSection
        config={config.text}
        handlers={handlers.text}
        activeTool={activeTool}
      />
      <ShapeSection config={config.shapes} handlers={handlers.shapes} />
      <DrawSection
        config={config.drawing}
        handlers={handlers.drawing}
        activeTool={activeTool}
      />
      <div className={styles.sidebarSection}>
        <Button
          className={styles.primaryBtn}
          onClick={handlers.triggerImageUpload}
          title="Import Image"
        >
          <ArrowUpFromLine size={20} />
        </Button>
      </div>
    </aside>
  );
}

ToolbarSection.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  config: PropTypes.shape({
    text: PropTypes.shape({
      font: PropTypes.string.isRequired,
      fontSize: PropTypes.number.isRequired,
      bold: PropTypes.bool.isRequired,
      italic: PropTypes.bool.isRequired,
      underline: PropTypes.bool.isRequired,
    }).isRequired,
    shapes: PropTypes.shape({
      isFilled: PropTypes.bool.isRequired,
    }).isRequired,
    drawing: PropTypes.shape({
      isDrawing: PropTypes.bool.isRequired,
      brushSize: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    text: PropTypes.shape({
      addText: PropTypes.func.isRequired,
      changeFont: PropTypes.func.isRequired,
      changeSize: PropTypes.func.isRequired,
      toggleStyle: PropTypes.func.isRequired,
    }).isRequired,
    shapes: PropTypes.shape({
      setFilled: PropTypes.func.isRequired,
      addShape: PropTypes.func.isRequired,
    }).isRequired,
    drawing: PropTypes.shape({
      toggleDrawing: PropTypes.func.isRequired,
      setBrushSize: PropTypes.func.isRequired,
    }).isRequired,
    triggerImageUpload: PropTypes.func.isRequired,
  }).isRequired,
  activeTool: PropTypes.string,
};
