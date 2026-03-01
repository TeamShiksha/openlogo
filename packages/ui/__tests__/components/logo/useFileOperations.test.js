import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFileOperations } from "../../../src/components/logo/useFileOperations";

vi.mock("fabric", () => ({
  FabricImage: {
    fromURL: vi.fn(),
  },
}));

const createCanvasMock = () => ({
  toDataURL: vi.fn(() => "data:image/png;base64,MOCK"),
  toSVG: vi.fn(() => "<svg></svg>"),
  toJSON: vi.fn(() => ({ objects: [] })),
  add: vi.fn(),
  setActiveObject: vi.fn(),
  renderAll: vi.fn(),
  width: 500,
  height: 500,
});

describe("useFileOperations (simple)", () => {
  let canvasRef;
  let toast;

  beforeEach(() => {
    canvasRef = { current: createCanvasMock() };
    toast = {
      error: vi.fn(),
      success: vi.fn(),
    };

    // mock DOM APIs used for downloads
    vi.spyOn(document, "createElement").mockReturnValue({
      click: vi.fn(),
      set href(_) {},
      set download(_) {},
    });
    vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
    vi.spyOn(document.body, "removeChild").mockImplementation(() => {});
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
  });

  /* ------------------ tests ------------------ */

  it("returns canvas data URL", () => {
    const api = useFileOperations(canvasRef, false, toast);

    const url = api.getCanvasDataUrl();

    expect(url).toBe("data:image/png;base64,MOCK");
    expect(canvasRef.current.toDataURL).toHaveBeenCalled();
  });

  it("returns allowed file types string", () => {
    const api = useFileOperations(canvasRef, false, toast);

    expect(api.getAllowedFileTypes()).toContain("image/png");
    expect(api.getAllowedFileTypes()).toContain("image/svg+xml");
  });

  it("prevents export for guests", () => {
    const api = useFileOperations(canvasRef, true, toast);

    api.handleExport("png");

    expect(toast.error).toHaveBeenCalledWith("Guests cannot export logos");
    expect(canvasRef.current.toDataURL).not.toHaveBeenCalled();
  });

  it("exports PNG when allowed", () => {
    const api = useFileOperations(canvasRef, false, toast);

    api.handleExport("png");

    expect(canvasRef.current.toDataURL).toHaveBeenCalledWith({
      format: "png",
      multiplier: 2,
    });
  });

  it("exports SVG", () => {
    const api = useFileOperations(canvasRef, false, toast);

    api.handleExport("svg");

    expect(canvasRef.current.toSVG).toHaveBeenCalled();
  });

  it("exports JSON", () => {
    const api = useFileOperations(canvasRef, false, toast);

    api.handleExport("json");

    expect(canvasRef.current.toJSON).toHaveBeenCalled();
  });
});
