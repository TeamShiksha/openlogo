import Button from "../../components/common/button/Button";
import {
  AArrowDown,
  AArrowUp,
  ChevronLeft,
  Copy,
  Menu,
  Redo,
  Trash,
  Undo,
} from "lucide-react";
import styles from "./TopToolbar.module.css";
import PropTypes from "prop-types";
import { useMemo } from "react";

const toolbarButtons = [
  {
    icon: <ChevronLeft size={18} />,
    title: "Toggle sidebar",
    action: "toggle",
    variant: "secondary",
  },
  {
    icon: <Copy size={18} />,
    title: "Duplicate (Ctrl+D)",
    action: "duplicate",
    variant: "secondary",
  },
  {
    icon: <Trash size={18} />,
    title: "Delete (Del)",
    action: "delete",
    variant: "secondary",
  },
  {
    icon: <AArrowUp size={18} />,
    title: "Bring to Front",
    action: "front",
    variant: "secondary",
  },
  {
    icon: <AArrowDown size={18} />,
    title: "Send to Back",
    action: "back",
    variant: "secondary",
  },
  {
    icon: <Undo size={18} />,
    title: "Undo",
    action: "undo",
    variant: "secondary",
  },
  {
    icon: <Redo size={18} />,
    title: "Redo",
    action: "redo",
    variant: "secondary",
  },
];

export default function TopToolbar({
  sidebarOpen,
  setSidebarOpen,
  duplicateSelected,
  deleteSelected,
  bringToFront,
  sendToBack,
  undo,
  redo,
  resetCanvas,
  currentColor,
  handleChangeColor,
  handleUploadClick,
  handleExport,
  exportType,
  setExportType,
  isGuest,
}) {
  const handleButtonClick = (action) => {
    const actions = {
      toggle: () => {
        setSidebarOpen((prev) => !prev);
        setTimeout(() => window.dispatchEvent(new Event("resize")), 400);
      },
      duplicate: duplicateSelected,
      delete: deleteSelected,
      front: bringToFront,
      back: sendToBack,
      undo: undo,
      redo: redo,
    };
    actions[action]?.();
  };

  const updatedToolbarButtons = useMemo(() => {
    return toolbarButtons.map((btn) =>
      btn.action === "toggle"
        ? {
            ...btn,
            icon: sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />,
          }
        : btn
    );
  }, [sidebarOpen]);

  return (
    <div className={styles.topToolbar}>
      <div className={styles.toolbarSection}>
        <div className={styles.toolbarMidSection}>
          {updatedToolbarButtons.map((btn, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(btn.action)}
              title={btn.title}
              variant={btn.variant}
            >
              {btn.icon}
            </Button>
          ))}

          <Button
            onClick={resetCanvas}
            title="Reset Canvas"
            variant="secondary"
          >
            <span style={{ fontSize: "12px", fontWeight: "bold" }}>RESET</span>
          </Button>

          <input
            type="color"
            value={currentColor}
            onChange={handleChangeColor}
            className={styles.colorPicker}
            title="Color"
          />

          <Button
            onClick={handleUploadClick}
            title="Upload"
            className={styles.primaryBtn}
            disabled={isGuest}
            variant="primary"
          >
            Upload
          </Button>

          <Button
            onClick={handleExport}
            title="Export"
            className={styles.primaryBtn}
            disabled={isGuest}
            variant="primary"
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
  );
}

TopToolbar.propTypes = {
  sidebarOpen: PropTypes.bool.isRequired,
  setSidebarOpen: PropTypes.func.isRequired,
  duplicateSelected: PropTypes.func.isRequired,
  deleteSelected: PropTypes.func.isRequired,
  bringToFront: PropTypes.func.isRequired,
  sendToBack: PropTypes.func.isRequired,
  undo: PropTypes.func.isRequired,
  redo: PropTypes.func.isRequired,
  resetCanvas: PropTypes.func.isRequired,
  currentColor: PropTypes.string.isRequired,
  handleChangeColor: PropTypes.func.isRequired,
  handleUploadClick: PropTypes.func.isRequired,
  handleExport: PropTypes.func.isRequired,
  exportType: PropTypes.string.isRequired,
  setExportType: PropTypes.func.isRequired,
  isGuest: PropTypes.bool.isRequired,
};
