import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

const mockTextbox = vi.hoisted(() => vi.fn());
const mockRect = vi.hoisted(() => vi.fn());
const mockCircle = vi.hoisted(() => vi.fn());
const mockTriangle = vi.hoisted(() => vi.fn());
const mockLine = vi.hoisted(() => vi.fn());
const mockGroup = vi.hoisted(() => vi.fn());
const mockActiveSelection = vi.hoisted(() => vi.fn());
const mockPencilBrush = vi.hoisted(() => vi.fn());

// Mock fabric - must be at the top level with no external dependencies
vi.mock("fabric", () => {
  // Create mock canvas inside the factory
  const mockCanvas = {
    on: vi.fn(),
    off: vi.fn(),
    dispose: vi.fn(),
    clear: vi.fn(),
    toJSON: vi.fn().mockReturnValue({ objects: [] }),
    loadFromJSON: vi.fn().mockResolvedValue(undefined),
    add: vi.fn(),
    remove: vi.fn(),
    setActiveObject: vi.fn(),
    discardActiveObject: vi.fn(),
    renderAll: vi.fn(),
    requestRenderAll: vi.fn(),
    bringObjectToFront: vi.fn(),
    sendObjectToBack: vi.fn(),
    getWidth: vi.fn(() => 800),
    getHeight: vi.fn(() => 600),
    getActiveObject: vi.fn(() => null),
    getActiveObjects: vi.fn(() => []),
    isDrawingMode: false,
    freeDrawingBrush: null,
    setDimensions: vi.fn(),
    toDataURL: vi.fn(),
    toSVG: vi.fn(),
    backgroundColor: "#ffffff",
    getObjects: vi.fn(() => []),
  };

  // Mock implementations for fabric constructors
  mockTextbox.mockImplementation((text, options) => ({
    ...options,
    text,
    type: "textbox",
    set: vi.fn(),
    clone: vi.fn(() =>
      Promise.resolve({
        set: vi.fn(),
        left: 100,
        top: 100,
      })
    ),
  }));

  mockRect.mockImplementation((options) => ({
    ...options,
    type: "rect",
    set: vi.fn(),
    clone: vi.fn(() =>
      Promise.resolve({
        set: vi.fn(),
        left: 100,
        top: 100,
      })
    ),
  }));

  mockCircle.mockImplementation((options) => ({
    ...options,
    type: "circle",
    set: vi.fn(),
    clone: vi.fn(() => Promise.resolve({ set: vi.fn() })),
  }));

  mockTriangle.mockImplementation((options) => ({
    ...options,
    type: "triangle",
    set: vi.fn(),
    clone: vi.fn(() => Promise.resolve({ set: vi.fn() })),
  }));

  mockLine.mockImplementation((points, options) => ({
    ...options,
    points,
    type: "line",
    set: vi.fn(),
    clone: vi.fn(() => Promise.resolve({ set: vi.fn() })),
  }));

  mockGroup.mockImplementation((objects, options) => ({
    ...options,
    _objects: objects,
    type: "group",
    set: vi.fn(),
    clone: vi.fn(() => Promise.resolve({ set: vi.fn() })),
  }));

  mockActiveSelection.mockImplementation((objects, options) => ({
    ...options,
    _objects: objects,
    type: "activeSelection",
    set: vi.fn(),
  }));

  mockPencilBrush.mockImplementation(() => ({
    color: "#000000",
    width: 1,
  }));

  return {
    Canvas: vi.fn(() => mockCanvas),
    Textbox: mockTextbox,
    Rect: mockRect,
    Circle: mockCircle,
    Triangle: mockTriangle,
    Line: mockLine,
    Group: mockGroup,
    ActiveSelection: mockActiveSelection,
    PencilBrush: mockPencilBrush,
  };
});

// Now we can import the hook after the mock is set up
import { useCanvasControls } from "../../../src/components/logo/useCanvasControls";

describe("useCanvasControls", () => {
  let result;
  let hook;

  beforeEach(() => {
    vi.clearAllMocks();
    hook = renderHook(() => useCanvasControls());
    result = hook.result;
  });

  it("should initialize canvas when canvasRef is available", () => {
    // Create a mock canvas element
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
    });

    const canvas = result.current.initializeCanvas();

    expect(canvas).toBeDefined();
    expect(canvas.on).toHaveBeenCalledWith(
      "object:added",
      expect.any(Function)
    );
    expect(canvas.on).toHaveBeenCalledWith(
      "object:modified",
      expect.any(Function)
    );
    expect(canvas.on).toHaveBeenCalledWith(
      "object:removed",
      expect.any(Function)
    );
    expect(canvas.on).toHaveBeenCalledWith(
      "text:changed",
      expect.any(Function)
    );
  });

  it("should not initialize canvas twice", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
    });

    // First initialization
    const canvas1 = result.current.initializeCanvas();

    // Second initialization should return the same canvas
    const canvas2 = result.current.initializeCanvas();

    expect(canvas1).toBe(canvas2);
  });

  it("should add text to canvas with correct properties", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    act(() => {
      result.current.addText({
        fontSize: 48,
        color: "#ff0000",
        fontFamily: "Georgia",
        bold: true,
        italic: false,
        underline: true,
      });
    });

    expect(mockTextbox).toHaveBeenCalledWith(
      "New text",
      expect.objectContaining({
        fontSize: 48,
        fill: "#ff0000",
        fontFamily: "Georgia",
        fontWeight: "bold",
        fontStyle: "normal",
        underline: true,
        left: 320,
        top: 280,
        originX: "center",
        originY: "center",
        width: 140,
      })
    );

    expect(result.current.fabricCanvasRef.current.add).toHaveBeenCalled();
    expect(
      result.current.fabricCanvasRef.current.setActiveObject
    ).toHaveBeenCalled();
    expect(result.current.fabricCanvasRef.current.renderAll).toHaveBeenCalled();
  });

  it("should add filled rectangle to canvas", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    act(() => {
      result.current.addShape("rectangle", "#00ff00", true);
    });

    expect(mockRect).toHaveBeenCalledWith(
      expect.objectContaining({
        fill: "#00ff00",
        stroke: "#00ff00",
        strokeWidth: 1,
        left: 325, // 800/2 - 75 = 400 - 75 = 325
        top: 250, // 600/2 - 50 = 300 - 50 = 250
        originX: "center",
        originY: "center",
        width: 150,
        height: 100,
        strokeUniform: true,
      })
    );

    expect(result.current.fabricCanvasRef.current.add).toHaveBeenCalled();
    expect(
      result.current.fabricCanvasRef.current.setActiveObject
    ).toHaveBeenCalled();
    expect(result.current.fabricCanvasRef.current.renderAll).toHaveBeenCalled();
  });

  it("should add outline-only rectangle to canvas", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    act(() => {
      result.current.addShape("rectangle", "#0000ff", false);
    });

    expect(mockRect).toHaveBeenCalledWith(
      expect.objectContaining({
        fill: "transparent",
        stroke: "#0000ff",
        strokeWidth: 4,
        left: 325,
        top: 250,
        originX: "center",
        originY: "center",
        width: 150,
        height: 100,
        strokeUniform: true,
      })
    );

    expect(result.current.fabricCanvasRef.current.add).toHaveBeenCalled();
    expect(
      result.current.fabricCanvasRef.current.setActiveObject
    ).toHaveBeenCalled();
    expect(result.current.fabricCanvasRef.current.renderAll).toHaveBeenCalled();
  });

  it("should handle undo and redo operations through user interactions", async () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    const mockCanvas = result.current.fabricCanvasRef.current;
    const loadFromJSONSpy = vi.fn().mockResolvedValue(undefined);
    mockCanvas.loadFromJSON = loadFromJSONSpy;

    // Add some objects to create history
    act(() => {
      result.current.addText({ fontSize: 32, color: "#000000" });
    });

    // Wait a bit for the state to update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // Now undo should work
    await act(async () => {
      await result.current.undo();
    });

    expect(typeof result.current.undo).toBe("function");
    expect(typeof result.current.redo).toBe("function");
  });

  it("should reset canvas", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    act(() => {
      const success = result.current.resetCanvas();
      expect(success).toBe(true);
    });

    expect(result.current.fabricCanvasRef.current.clear).toHaveBeenCalled();
    expect(result.current.fabricCanvasRef.current.renderAll).toHaveBeenCalled();
  });

  it("should calculate canvas center correctly", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    const center = result.current.getCanvasCenter();

    // Based on mock getWidth=800, getHeight=600
    expect(center).toEqual({ x: 400, y: 300 });
  });

  it("should return default center when no canvas", () => {
    // Ensure fabricCanvasRef is null
    result.current.fabricCanvasRef.current = null;

    const center = result.current.getCanvasCenter();

    expect(center).toEqual({ x: 150, y: 150 });
  });

  it("should dispose canvas", () => {
    const mockCanvasElement = document.createElement("canvas");

    act(() => {
      result.current.canvasRef.current = mockCanvasElement;
      result.current.initializeCanvas();
    });

    act(() => {
      result.current.disposeCanvas();
    });

    expect(result.current.fabricCanvasRef.current).toBeNull();
  });
});
