import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Demo from "../../src/components/demo/Demo.jsx";
import { ToastContext, AuthContext } from "../../src/contexts/Contexts.jsx";
import { BUTTON_TEXT } from "../../src/utils/Constants.js";

const mockUseApi = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => mockUseApi(),
}));

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

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
      data: [],
      loading: false,
      errorMsg: null,
    });
  });

  it("renders the Demo component correctly", () => {
    const authContext = mockAuthContext(true);
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );
    expect(screen.getByText("See In Action")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("displays up to 3 search results after fetching", async () => {
    const authContext = mockAuthContext(true);
    mockUseApi.mockReturnValue({
      makeRequest: vi.fn(),
      data: {
        data: [
          { companyName: "Aalto", image: "aalto-logo.svg" },
          { companyName: "Aareon", image: "aareon-logo.svg" },
          { companyName: "Aavid", image: "aavid-logo.svg" },
          { companyName: "Aastra", image: "aastra-logo.svg" },
        ],
      },
      loading: false,
      errorMsg: null,
    });

    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "aa" },
    });
    fireEvent.submit(screen.getByAltText("Search"));

    await waitFor(() => {
      expect(screen.getByText("Aalto")).toBeInTheDocument();
      expect(screen.getByText("Aareon")).toBeInTheDocument();
      expect(screen.getByText("Aavid")).toBeInTheDocument();
      expect(screen.queryByText("Aastra")).not.toBeInTheDocument();
    });
  });

  it("shows Loading spinner when loading is true", async () => {
    const authContext = mockAuthContext(true);
    mockUseApi.mockReturnValue({
      makeRequest: vi.fn(),
      data: [],
      loading: true,
      errorMsg: null,
    });
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "nope" },
    });
    fireEvent.submit(screen.getByAltText("Search"));

    await waitFor(() => {
      const loadingSpinner = screen.getByTestId("spinner");
      expect(loadingSpinner).toBeInTheDocument();
    });
  });

  it("shows 'No results' and request button if search returns nothing", async () => {
    const authContext = mockAuthContext(true);
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
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

  it("opens LogoRequestForm modal when request logo is clicked and user is authenticated", async () => {
    const authContext = mockAuthContext(true);
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "nothing" },
      });
      fireEvent.submit(screen.getByAltText("Search"));
      fireEvent.click(
        screen.getByRole("button", { name: BUTTON_TEXT.requestLogo })
      );
    });
    await waitFor(() => {
      const logoRequestFormModal = screen.getAllByText("Request Logo");
      expect(logoRequestFormModal.length).toBe(2);
    });
  });

  it("opens auth modal when request logo is clicked and user is not authenticated", async () => {
    const authContext = mockAuthContext(false);
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "nothing" },
      });
      fireEvent.submit(screen.getByAltText("Search"));
      fireEvent.click(
        screen.getByRole("button", { name: BUTTON_TEXT.requestLogo })
      );
    });
    await waitFor(() => {
      expect(mockOpenAuthModal).toHaveBeenCalled();
    });
  });

  it("closes the LogoRequestForm modal when the close button is clicked", async () => {
    const authContext = mockAuthContext(true);
    render(
      <AuthContext.Provider value={authContext}>
        <ToastContext.Provider value={mockToastContext}>
          <Demo openAuthModal={mockOpenAuthModal} />
        </ToastContext.Provider>
      </AuthContext.Provider>
    );
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Search"), {
        target: { value: "nothing" },
      });
      fireEvent.submit(screen.getByAltText("Search"));
      fireEvent.click(
        screen.getByRole("button", { name: BUTTON_TEXT.requestLogo })
      );
    });
    await waitFor(() => {
      const logoRequestFormModal = screen.getAllByText("Request Logo");
      expect(logoRequestFormModal.length).toBe(2);
    });

    fireEvent.click(screen.getByRole("button", { name: BUTTON_TEXT.cross }));
    const modalClosed = screen.getAllByText("Request Logo");
    expect(modalClosed.length).toBe(1);
  });
});
