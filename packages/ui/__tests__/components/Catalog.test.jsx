import { expect, describe, it, vi, afterEach, beforeEach } from "vitest";
import { fireEvent, render, screen, act } from "@testing-library/react";
import Catalog from "../../src/components/catalog/Catalog";
import { COMPANIES } from "../../src/utils/Constants";
import { ToastContext } from "../../src/contexts/Contexts";
import { useApi } from "../../src/hooks/useApi";

const mockData = {
  data: {
    data: COMPANIES,
    totalPages: 1,
  },
};

const mockWebData = {
  source: "web-search",
  data: [
    {
      companyName: "WebResultCo",
      url: "https://example.com/logo.png",
      companyUri: "https://webresultco.com",
    },
  ],
};

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.useFakeTimers();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: vi.fn(() => ({
    data: mockData,
    loading: false,
    errorMsg: null,
    makeRequest: vi.fn(),
    fetchRequest: vi.fn(),
  })),
}));

class MockFileReader {
  readAsDataURL() {
    setTimeout(() => {
      this.onload?.({
        target: { result: "data:image/png;base64,fake-preview" },
      });
    }, 10);
  }
}
globalThis.FileReader = MockFileReader;

globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    blob: () =>
      Promise.resolve(new Blob(["fake-image"], { type: "image/png" })),
  })
);

describe("Catalog Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useFakeTimers();
  });

  it("Search bar should be visible", () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Catalog />
      </ToastContext.Provider>
    );

    expect(document.querySelector("input")).toBeInTheDocument();
  });

  it("Add image button should be visible", () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Catalog />
      </ToastContext.Provider>
    );

    expect(screen.getByText("Add image")).toBeInTheDocument();
  });

  it("Should open modal when Add image button is clicked", () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Catalog />
      </ToastContext.Provider>
    );

    fireEvent.click(screen.getByText("Add image"));
    vi.runAllTimers();

    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("should debounce search input and call makeRequest after 500ms", async () => {
    const makeRequestMock = vi.fn();

    vi.mocked(useApi).mockReturnValue({
      data: { data: { data: [], totalPages: 1 } },
      loading: false,
      errorMsg: null,
      makeRequest: makeRequestMock,
      fetchRequest: vi.fn(),
    });

    render(
      <ToastContext.Provider value={mockToastContext}>
        <Catalog />
      </ToastContext.Provider>
    );

    fireEvent.change(document.querySelector("input"), {
      target: { value: "Amazon" },
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(makeRequestMock).toHaveBeenCalledTimes(2);
  });

  describe("Web Search Integration", () => {
    it("Should hide web results when search input is cleared", async () => {
      vi.mocked(useApi).mockReturnValueOnce({
        data: mockWebData,
        loading: false,
        errorMsg: null,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
      });

      render(
        <ToastContext.Provider value={mockToastContext}>
          <Catalog />
        </ToastContext.Provider>
      );

      fireEvent.change(document.querySelector("input"), {
        target: { value: "" },
      });

      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(document.querySelector("input").value).toBe("");
    });
  });
});
