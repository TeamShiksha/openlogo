import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, expect, describe, it, beforeEach } from "vitest";
import ChangePassword from "../../src/components/changepassword/ChangePassword.jsx";
import {
  BUTTON_TEXT,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FIELDS,
} from "../../src/utils/Constants";

const mockUseApi = vi.fn();
const mockMakeRequest = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => mockUseApi(),
}));

vi.mock("../../src/hooks/useToast", () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}));

let mockApiReturn;

describe("ChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockApiReturn = {
      makeRequest: mockMakeRequest,
      data: null,
      errorMsg: "",
      isSuccess: false,
      loading: false,
    };

    mockUseApi.mockImplementation(() => mockApiReturn);
  });

  it("renders form fields and button", () => {
    render(<ChangePassword isGuest={false} />);
    CHANGE_PASSWORD_FIELDS.forEach((field) => {
      const fieldLabel = screen.getByLabelText(field.label);
      expect(fieldLabel).toBeInTheDocument();
    });
    const changepasswordButton = screen.getByRole("button", {
      name: BUTTON_TEXT.changePasswordLabel,
    });
    expect(changepasswordButton).toBeInTheDocument();
  });

  it("validates fields on focus", async () => {
    render(<ChangePassword isGuest={false} />);
    const currPasswordInput = screen.getByLabelText(/current password/i);
    fireEvent.focus(currPasswordInput);

    await waitFor(() => {
      const currPasswordRequired = screen.getByText(
        CHANGE_PASSWORD.currRequired
      );
      expect(currPasswordRequired).toBeInTheDocument();
    });
  });

  it("disables button when form is invalid or loading", () => {
    mockApiReturn.loading = true;
    render(<ChangePassword isGuest={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows success toast on successful response", async () => {
    mockMakeRequest.mockResolvedValue({ statusCode: 200 });
    mockApiReturn.loading = false;
    mockApiReturn.errorMsg = "";
    render(<ChangePassword isGuest={false} />);
    const currInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/new password/i);
    const button = screen.getByRole("button", { name: /change password/i });
    fireEvent.change(currInput, { target: { value: "Oldpass@123" } });
    fireEvent.change(newInput, { target: { value: "Newpass@121" } });
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Password updated successfully"
      );
    });
  });

  it("shows error toast on incorrect password", async () => {
    mockMakeRequest.mockResolvedValue({ statusCode: 400 });
    mockApiReturn.errorMsg = "Incorrect current password";
    render(<ChangePassword isGuest={false} />);
    const currPassword = screen.getByLabelText(/current password/i);
    fireEvent.change(currPassword, { target: { value: "wrongpass@123" } });
    const newPassword = screen.getByLabelText(/new password/i);
    fireEvent.change(newPassword, {
      target: { value: "Newpass@123" },
    });
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Incorrect current password");
    });
  });

  it("does not submit form when validation errors exist", async () => {
    render(<ChangePassword isGuest={false} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    await waitFor(() => {
      expect(mockMakeRequest).not.toHaveBeenCalled();
    });
  });

  it("prevents form submission if user is guest", () => {
    render(<ChangePassword isGuest={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
