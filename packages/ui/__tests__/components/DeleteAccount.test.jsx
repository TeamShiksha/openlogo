import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import {
  DELETE_ACCOUNT_CONFIRMATION_MODAL,
  MOCK_USER_DATA,
} from "../../src/utils/Constants";
import {
  AuthContext,
  ToastContext,
  UserContext,
} from "../../src/contexts/Contexts";
import DeleteAccountConfirmationModal from "../../src/components/settings/DeleteAccountConfirmationModal";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const mockMakeRequest = vi.fn();
vi.mock("../../../../src/hooks/useApi.js", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    errorMsg: "",
  }),
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

describe("DeleteAccountConfirmationModal Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with correct title and description", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    expect(
      screen.getByText(DELETE_ACCOUNT_CONFIRMATION_MODAL.title)
    ).toBeInTheDocument();
    expect(
      screen.getByText(DELETE_ACCOUNT_CONFIRMATION_MODAL.subText)
    ).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={false}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    expect(
      screen.queryByTestId("delete-account-modal")
    ).not.toBeInTheDocument();
  });

  it("handles email input correctly", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: MOCK_USER_DATA.email } });
    expect(emailInput.value).toBe(MOCK_USER_DATA.email);
  });

  it("disables delete button when email doesn't match user email", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const deleteButton = screen.getByRole("button", {
      name: DELETE_ACCOUNT_CONFIRMATION_MODAL.primaryButtonText,
    });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    expect(deleteButton).toBeDisabled();
  });

  it("enables delete button when email matches user email", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const deleteButton = screen.getByRole("button", {
      name: DELETE_ACCOUNT_CONFIRMATION_MODAL.primaryButtonText,
    });

    fireEvent.change(emailInput, { target: { value: MOCK_USER_DATA.email } });
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole("button", {
      name: DELETE_ACCOUNT_CONFIRMATION_MODAL.secondaryButtonText,
    });

    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles successful account deletion", async () => {
    mockMakeRequest.mockResolvedValue(true);

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: vi.fn() };

    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ setIsAuthenticated: vi.fn() }}>
            <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
              <DeleteAccountConfirmationModal
                isOpen={true}
                onClose={mockOnClose}
              />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const deleteButton = screen.getByRole("button", {
      name: DELETE_ACCOUNT_CONFIRMATION_MODAL.primaryButtonText,
    });

    fireEvent.change(emailInput, { target: { value: MOCK_USER_DATA.email } });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockMakeRequest).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    window.location = originalLocation;
  });
});
