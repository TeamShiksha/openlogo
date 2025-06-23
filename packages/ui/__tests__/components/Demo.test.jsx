import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Demo from "../../src/components/demo/Demo.jsx";
import { ToastContext } from "../../src/contexts/Contexts.jsx";

const mockUseApi = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => mockUseApi(),
}));

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

describe("Demo Component", () => {
  const mockOpenAuthModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApi.mockReturnValue({
      makeRequest: vi.fn(),
      data: {
        data: [],
      },
      loading: false,
      errorMsg: null,
    });
  });

  it("renders the Demo component correctly", () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Demo openAuthModal={mockOpenAuthModal} />
      </ToastContext.Provider>
    );
    expect(screen.getByText("See In Action")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("displays up to 3 search results after fetching", async () => {
    mockUseApi.mockReturnValue({
      makeRequest: vi.fn(),
      data: {
        data: [
          { companyName: "Apple", image: "apple-logo.svg" },
          { companyName: "Amazon", image: "amazon-logo.svg" },
          { companyName: "Adobe", image: "adobe-logo.svg" },
          { companyName: "Airbnb", image: "airbnb-logo.svg" },
        ],
      },
      loading: false,
      errorMsg: null,
    });

    render(
      <ToastContext.Provider value={mockToastContext}>
        <Demo openAuthModal={mockOpenAuthModal} />
      </ToastContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "aa" },
    });
    fireEvent.submit(screen.getByAltText("Search"));

    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Amazon")).toBeInTheDocument();
      expect(screen.getByText("Adobe")).toBeInTheDocument();
      expect(screen.queryByText("Airbnb")).not.toBeInTheDocument();
    });
  });

  it("shows 'No results' and request button if search returns nothing", async () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Demo openAuthModal={mockOpenAuthModal} />
      </ToastContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "nope" },
    });
    fireEvent.submit(screen.getByAltText("Search"));

    await waitFor(() => {
      expect(screen.getByText(/did not match any logo/i)).toBeInTheDocument();
      expect(screen.getByText("Request Logo")).toBeInTheDocument();
    });
  });

  it("calls openAuthModal when request button is clicked", async () => {
    render(
      <ToastContext.Provider value={mockToastContext}>
        <Demo openAuthModal={mockOpenAuthModal} />
      </ToastContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "nothing" },
    });
    fireEvent.submit(screen.getByAltText("Search"));

    await waitFor(() => {
      fireEvent.click(screen.getByText("Request Logo"));
      expect(mockOpenAuthModal).toHaveBeenCalledTimes(1);
    });
  });
});
