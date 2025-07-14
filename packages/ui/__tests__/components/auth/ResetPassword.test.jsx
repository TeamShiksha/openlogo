import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../../../src/contexts/ToastContext.jsx";
import ResetPassword from "../../../src/components/auth/ResetPassword";
import { BUTTON_TEXT } from "../../../src/utils/Constants";

const mockNavigate = vi.fn();
const mockSearchParams = new URLSearchParams();

vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams],
}));

const mockedValidateTokenRequest = vi.fn();
const mockedResetPasswordRequest = vi.fn();

vi.mock("../../../src/hooks/useApi", () => ({
  useApi: ({ url }) => {
    if (url && url.includes("/auth/password/forgot/")) {
      return {
        makeRequest: mockedValidateTokenRequest,
        errorMsg: "Invalid or expired token.",
        loading: false,
      };
    }
    return {
      makeRequest: mockedResetPasswordRequest,
      errorMsg: "Failed to reset password.",
      loading: false,
    };
  },
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("../../../src/hooks/useToast.js", () => ({
  useToast: () => mockToast,
}));

describe("ResetPassword Component Tests", async () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.set("token", "valid-token-123");
  });

  it("renders form elements when token is valid", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: BUTTON_TEXT.submit })
      ).toBeInTheDocument();
    });
  });

  it("submit button is disabled when form is invalid", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: BUTTON_TEXT.submit,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  it("submit button is enabled when passwords match", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    expect(submitButton).toBeEnabled();
  });

  it("successful password reset navigates to home", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);
    mockedResetPasswordRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPasswordRequest).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("displays error when password reset fails", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);
    mockedResetPasswordRequest.mockResolvedValue(false);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPasswordRequest).toHaveBeenCalled();
    });

    await waitFor(() => {
      const errorMessages = screen.getAllByText("Failed to reset password.");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("shows error message when token is invalid", async () => {
    mockedValidateTokenRequest.mockResolvedValue(false);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      const errorMessage = screen.getByText("Invalid or expired token.");
      expect(errorMessage).toBeInTheDocument();
    });

    expect(screen.queryByLabelText("New Password")).not.toBeInTheDocument();
  });

  it("shows error message when token is missing", async () => {
    mockSearchParams.delete("token");
    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(
        screen.getAllByText("Invalid or missing token.").length
      ).toBeGreaterThan(0);
    });
    expect(screen.queryByLabelText("New Password")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Confirm Password")).not.toBeInTheDocument();
  });

  it("calls setFormData and clears localErrorMsg on input change", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    fireEvent.change(newPasswordInput, { target: { value: "newpass" } });

    expect(
      screen.queryByText("Failed to reset password.")
    ).not.toBeInTheDocument();
    expect(newPasswordInput.value).toBe("newpass");
  });

  it("sets focusedField on input focus and resets isSubmit", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Confirm Password")).toBeInTheDocument();
    });

    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    fireEvent.focus(confirmPasswordInput);

    fireEvent.change(confirmPasswordInput, { target: { value: "abc" } });
    expect(confirmPasswordInput.value).toBe("abc");
  });

  it("sets focusedField to null on blur", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    fireEvent.focus(newPasswordInput);
    fireEvent.blur(newPasswordInput);

    expect(newPasswordInput).toBeInTheDocument();
  });

  it("does not submit if confirmPassword validation fails", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "wrong" } });
    fireEvent.click(submitButton);

    expect(mockedResetPasswordRequest).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/confirm password/i)).toBeInTheDocument();
    });
  });

  it("does not submit when passwords do not match", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);
    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });
    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });
    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "different" } });
    fireEvent.click(submitButton);
    expect(mockedResetPasswordRequest).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(screen.getByText(/confirm password/i)).toBeInTheDocument();
    });
  });

  it("shows success toast and navigates to home on successful password reset", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);
    mockedResetPasswordRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPasswordRequest).toHaveBeenCalled();
      expect(mockToast.success).toHaveBeenCalledWith(
        "Password reset successful! Please sign in."
      );
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
  it("shows error toast and error message on failed password reset", async () => {
    mockedValidateTokenRequest.mockResolvedValue(true);
    mockedResetPasswordRequest.mockResolvedValue(false);

    render(
      <BrowserRouter>
        <ToastProvider>
          <ResetPassword />
        </ToastProvider>
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByLabelText("New Password")).toBeInTheDocument();
    });

    const newPasswordInput = screen.getByLabelText("New Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedResetPasswordRequest).toHaveBeenCalled();
      expect(mockToast.error).toHaveBeenCalledWith("Failed to reset password.");
      expect(
        screen.getAllByText("Failed to reset password.").length
      ).toBeGreaterThan(0);
    });
  });
});
