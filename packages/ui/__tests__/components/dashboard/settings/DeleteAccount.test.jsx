import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import {
  DELETE_ACCOUNT_CONFIRMATION_MODAL,
  MOCK_USER_DATA,
} from "../../../../src/utils/Constants";
import { UserContext } from "../../../../src/contexts/Contexts";
import DeleteAccountConfirmationModal from "../../../../src/components/dashboard/settingpage/DeleteAccountConfirmationModal";

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

describe("DeleteAccountConfirmationModal Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the modal with correct title and description", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
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
    const { container } = render(
      <BrowserRouter>
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal
            isOpen={false}
            onClose={mockOnClose}
          />
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("handles email input correctly", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: MOCK_USER_DATA.email } });
    expect(emailInput.value).toBe(MOCK_USER_DATA.email);
  });

  it("disables delete button when email doesn't match user email", () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
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
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
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
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
      </BrowserRouter>
    );

    const cancelButton = screen.getByRole("button", {
      name: DELETE_ACCOUNT_CONFIRMATION_MODAL.secondaryButtonText,
    });

    fireEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles successful account deletion", async () => {
    render(
      <BrowserRouter>
        <UserContext.Provider value={{ userData: MOCK_USER_DATA }}>
          <DeleteAccountConfirmationModal isOpen={true} onClose={mockOnClose} />
        </UserContext.Provider>
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
      expect(window.location.href).not.toContain(import.meta.env.VITE_APP_URL);
      expect(screen.getByTestId("error-msg")).toBeInTheDocument();
    });
  });
});
