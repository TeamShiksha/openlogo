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

const getSubmitButton = () => {
  const buttons = screen.getAllByRole("button");
  let submitButton = buttons.find((btn) => btn.type === "submit");
  return submitButton;
};

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
    const currPasswordInput = screen.getByLabelText("Current Password");
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
    const submitButton = getSubmitButton();
    expect(submitButton).toBeDisabled();
  });

  it("shows success toast on successful response", async () => {
    mockMakeRequest.mockResolvedValue({ statusCode: 200 });
    mockApiReturn.loading = false;
    mockApiReturn.errorMsg = "";
    render(<ChangePassword isGuest={false} />);
    const currInput = screen.getByLabelText("Current Password");
    const newInput = screen.getByLabelText("New Password");
    const submitButton = getSubmitButton();
    fireEvent.change(currInput, { target: { value: "Oldpass@123" } });
    fireEvent.change(newInput, { target: { value: "Newpass@121" } });
    fireEvent.click(submitButton);
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
    const currPassword = screen.getByLabelText("Current Password");
    fireEvent.change(currPassword, { target: { value: "Wrongpass@123" } });
    const newPassword = screen.getByLabelText("New Password");
    fireEvent.change(newPassword, {
      target: { value: "Newpass@123" },
    });
    const submitButton = getSubmitButton();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Incorrect current password");
    });
  });

  it("does not submit form when validation errors exist", async () => {
    render(<ChangePassword isGuest={false} />);
    const submitButton = getSubmitButton();
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockMakeRequest).not.toHaveBeenCalled();
    });
  });

  it("prevents form submission if user is guest", () => {
    render(<ChangePassword isGuest={true} />);
    const submitButton = getSubmitButton();
    expect(submitButton).toBeDisabled();
  });

  it("renders eye icon buttons for password fields", () => {
    render(<ChangePassword isGuest={false} />);
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");

    expect(currentPasswordInput).toBeInTheDocument();
    expect(newPasswordInput).toBeInTheDocument();

    const currentPasswordEyeButton = screen.getByRole("button", {
      name: /show current password/i,
    });
    const newPasswordEyeButton = screen.getByRole("button", {
      name: /show new password/i,
    });

    expect(currentPasswordEyeButton).toBeInTheDocument();
    expect(newPasswordEyeButton).toBeInTheDocument();
  });

  it("toggles current password visibility when clicking the eye icon", () => {
    render(<ChangePassword isGuest={false} />);
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const currentPasswordEyeButton = screen.getByRole("button", {
      name: /show current password/i,
    });

    expect(currentPasswordInput).toHaveAttribute("type", "password");
    expect(currentPasswordEyeButton).toHaveAttribute(
      "aria-label",
      "Show current password"
    );

    fireEvent.click(currentPasswordEyeButton);
    expect(currentPasswordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide current password/i })
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /hide current password/i })
    );
    expect(currentPasswordInput).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: /show current password/i })
    ).toBeInTheDocument();
  });

  it("toggles new password visibility when clicking the eye icon", () => {
    render(<ChangePassword isGuest={false} />);
    const newPasswordInput = screen.getByLabelText("New Password");
    const newPasswordEyeButton = screen.getByRole("button", {
      name: /show new password/i,
    });

    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(newPasswordEyeButton).toHaveAttribute(
      "aria-label",
      "Show new password"
    );

    fireEvent.click(newPasswordEyeButton);
    expect(newPasswordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide new password/i })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /hide new password/i }));
    expect(newPasswordInput).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: /show new password/i })
    ).toBeInTheDocument();
  });

  it("documents keyboard focus behavior of eye buttons (tabIndex)", () => {
    render(<ChangePassword isGuest={false} />);
    const currentPasswordEyeButton = screen.getByRole("button", {
      name: /show current password/i,
    });
    const newPasswordEyeButton = screen.getByRole("button", {
      name: /show new password/i,
    });

    expect(currentPasswordEyeButton.getAttribute("tabindex")).toBe("-1");
    expect(newPasswordEyeButton.getAttribute("tabindex")).toBe("-1");
  });

  it("toggles password fields independently", () => {
    render(<ChangePassword isGuest={false} />);
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const newPasswordInput = screen.getByLabelText("New Password");
    const currentPasswordEyeButton = screen.getByRole("button", {
      name: /show current password/i,
    });

    fireEvent.click(currentPasswordEyeButton);
    expect(currentPasswordInput).toHaveAttribute("type", "text");

    expect(newPasswordInput).toHaveAttribute("type", "password");
  });
});
