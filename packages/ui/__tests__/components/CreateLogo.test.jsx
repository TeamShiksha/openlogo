import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateLogo from "../../src/page/createlogo/CreateLogo";
import { UserContext } from "../../src/contexts/Contexts";
import { ToastContext } from "../../src/contexts/Contexts";

// Mock fabric
vi.mock("fabric", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Canvas: vi.fn().mockImplementation(() => ({
      setDimensions: vi.fn(),
      renderAll: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      dispose: vi.fn(),
      clear: vi.fn(),
      toJSON: vi.fn().mockReturnValue({ objects: [] }),
      loadFromJSON: vi.fn(),
      add: vi.fn(),
      remove: vi.fn(),
      getWidth: vi.fn().mockReturnValue(600),
      getHeight: vi.fn().mockReturnValue(400),
      getActiveObject: vi.fn().mockReturnValue(null),
      getActiveObjects: vi.fn().mockReturnValue([]),
      setActiveObject: vi.fn(),
      discardActiveObject: vi.fn(),
      requestRenderAll: vi.fn(),
      bringObjectToFront: vi.fn(),
      sendObjectToBack: vi.fn(),
      isDrawingMode: false,
      freeDrawingBrush: {
        color: "#000000",
        width: 5,
      },
    })),
    Textbox: vi.fn(),
    Rect: vi.fn(),
    Circle: vi.fn(),
    Triangle: vi.fn(),
    Line: vi.fn(),
    Image: {
      fromURL: vi.fn().mockResolvedValue({
        scaleToWidth: vi.fn(),
        set: vi.fn(),
      }),
    },
    PencilBrush: vi.fn(),
  };
});

// --------------------
// Mocks
// --------------------
const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

const renderCreateLogo = (role = "USER") =>
  render(
    <ToastContext.Provider value={mockToast}>
      <UserContext.Provider value={{ userData: { role } }}>
        <CreateLogo />
      </UserContext.Provider>
    </ToastContext.Provider>
  );

describe("CreateLogo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders main toolbar actions", () => {
    renderCreateLogo();

    expect(screen.getByTitle("Toggle sidebar")).toBeInTheDocument();
    expect(screen.getByTitle("Duplicate (Ctrl+D)")).toBeInTheDocument();
    expect(screen.getByTitle("Delete (Del)")).toBeInTheDocument();
    expect(screen.getByTitle("Undo")).toBeInTheDocument();
    expect(screen.getByTitle("Redo")).toBeInTheDocument();
    expect(screen.getByText("RESET")).toBeInTheDocument();
    expect(screen.getByText("EXPORT")).toBeInTheDocument();
  });

  it("renders text controls", () => {
    renderCreateLogo();

    expect(screen.getByText("Text")).toBeInTheDocument();
    expect(screen.getByTitle("Add Text")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "B" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "I" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "U" })).toBeInTheDocument();
  });

  it("changes font family", async () => {
    renderCreateLogo();

    const fontSelect = screen.getByDisplayValue("Arial");
    fireEvent.change(fontSelect, { target: { value: "Georgia" } });

    await waitFor(() => {
      expect(fontSelect).toHaveValue("Georgia");
    });
  });

  it("changes font size", async () => {
    renderCreateLogo();

    const sizeSelect = screen.getByDisplayValue("32");
    fireEvent.change(sizeSelect, { target: { value: "48" } });

    await waitFor(() => {
      expect(sizeSelect).toHaveValue("48");
    });
  });

  it("toggles bold, italic, underline buttons", () => {
    renderCreateLogo();

    const bold = screen.getByRole("button", { name: "B" });
    const italic = screen.getByRole("button", { name: "I" });
    const underline = screen.getByRole("button", { name: "U" });

    fireEvent.click(bold);
    expect(bold.className).not.toBe("");

    fireEvent.click(italic);
    expect(italic.className).not.toBe("");

    fireEvent.click(underline);
    expect(underline.className).not.toBe("");
  });

  it("renders shape buttons", () => {
    renderCreateLogo();

    expect(screen.getByTitle("Rectangle")).toBeInTheDocument();
    expect(screen.getByTitle("Circle")).toBeInTheDocument();
    expect(screen.getByTitle("Triangle")).toBeInTheDocument();
    expect(screen.getByTitle("Line")).toBeInTheDocument();
  });

  it("toggles fill and outline", () => {
    renderCreateLogo();

    const fillBtn = screen.getByRole("button", { name: "Fill" });
    const outlineBtn = screen.getByRole("button", { name: "Outline" });

    expect(fillBtn.className).not.toBe("");
    fireEvent.click(outlineBtn);
    expect(outlineBtn.className).not.toBe("");
  });

  it("enables drawing mode and updates brush size", () => {
    renderCreateLogo();

    const penTool = screen.getByTitle("Pen Tool");
    fireEvent.click(penTool);

    expect(penTool.className).not.toBe("");

    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "12" } });
    expect(slider).toHaveValue("12");
  });

  it("shows hidden image input and triggers it on upload click", () => {
    renderCreateLogo();

    const uploadBtn = screen.getByTitle("Import Image");

    const clickSpy = vi.spyOn(HTMLInputElement.prototype, "click");

    fireEvent.click(uploadBtn);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("prevents export for guest users", () => {
    renderCreateLogo("GUEST");

    fireEvent.click(screen.getByText("EXPORT"));
    expect(mockToast.error).toHaveBeenCalledWith("Guests cannot export logos");
  });

  it("changes export type", () => {
    renderCreateLogo();

    const select = screen.getByDisplayValue("PNG");
    fireEvent.change(select, { target: { value: "svg" } });

    expect(select).toHaveValue("svg");
  });

  it("clears canvas when reset is confirmed", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    renderCreateLogo();

    fireEvent.click(screen.getByText("RESET"));
    expect(mockToast.success).toHaveBeenCalledWith("Canvas cleared");
  });
});
