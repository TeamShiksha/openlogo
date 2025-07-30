import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, expect, describe, it, beforeEach } from "vitest";
import ChangePassword from "../../src/components/changepassword/ChangePassword.jsx";
import {
  BUTTON_TEXT,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_FIELDS,
} from "../../src/utils/Constants";

vi.mock("../../src/hooks/useApi", () => ({
  useApi: vi.fn(),
}));

vi.mock("../../src/hooks/useToast", () => ({
  useToast: vi.fn(),
}));

vi.mock("../../src/utils/Helpers", () => ({
  validateChangePassword: vi.fn(() => ({})),
}));

import { useApi } from "../../src/hooks/useApi";
import { useToast } from "../../src/hooks/useToast";
import { validateChangePassword } from "../../src/utils/Helpers";

describe("ChangePassword", () => {
  let makeRequestMock, toastSuccessMock, toastErrorMock;

  beforeEach(() => {
    makeRequestMock = vi.fn();
    toastSuccessMock = vi.fn();
    toastErrorMock = vi.fn();

    useApi.mockReturnValue({
      makeRequest: makeRequestMock,
      data: null,
      errorMsg: "",
      isSuccess: false,
      loading: false,
    });

    useToast.mockReturnValue({
      success: toastSuccessMock,
      error: toastErrorMock,
    });

    validateChangePassword.mockImplementation(() => ({}));
  });

  it("renders form fields and button", () => {
    render(<ChangePassword isGuest={false} />);
    CHANGE_PASSWORD_FIELDS.forEach((field) => {
      expect(screen.getByLabelText(field.label)).toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: BUTTON_TEXT.changePasswordLabel })
    ).toBeInTheDocument();
  });

  it("validates fields on blur", async () => {
    validateChangePassword.mockReturnValue({
      currPassword: CHANGE_PASSWORD.currRequired,
      newPassword: "",
    });

    render(<ChangePassword isGuest={false} />);
    const currPasswordInput = screen.getByLabelText(/current password/i);
    fireEvent.blur(currPasswordInput);

    await waitFor(() => {
      expect(
        screen.getByText("Current password is required")
      ).toBeInTheDocument();
    });
  });

  it("disables button when form is invalid or loading", () => {
    useApi.mockReturnValueOnce({
      makeRequest: makeRequestMock,
      data: null,
      errorMsg: "",
      isSuccess: false,
      loading: true,
    });

    render(<ChangePassword isGuest={false} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("shows success toast on successful response", async () => {
    const mockResponse = {
      statusCode: 200,
      message: "Password changed",
    };

    let apiState = {
      makeRequest: vi.fn(),
      data: null,
      errorMsg: "",
      isSuccess: false,
      loading: false,
    };

    useApi.mockImplementation(() => apiState);
    render(<ChangePassword isGuest={false} />);

    const currInput = screen.getByLabelText(/current password/i);
    const newInput = screen.getByLabelText(/new password/i);
    const button = screen.getByRole("button");

    fireEvent.change(currInput, { target: { value: "oldpass" } });
    fireEvent.change(newInput, { target: { value: "newpass123" } });

    validateChangePassword.mockReturnValue({});

    apiState.makeRequest.mockImplementation(async () => {
      apiState = {
        ...apiState,
        data: mockResponse,
        isSuccess: true,
        loading: false,
      };
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith("Password changed");
    });
  });

  it("shows error toast on incorrect password", async () => {
    let apiState = {
      makeRequest: vi.fn(),
      data: null,
      errorMsg: "",
      isSuccess: false,
      loading: false,
    };

    useApi.mockImplementation(() => apiState);
    render(<ChangePassword isGuest={false} />);

    fireEvent.change(screen.getByLabelText(/current password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "newpass123" },
    });

    validateChangePassword.mockReturnValue({});

    apiState.makeRequest.mockImplementation(async () => {
      apiState = {
        ...apiState,
        data: { statusCode: 400 },
        errorMsg: "Incorrect current password",
        loading: false,
        isSuccess: false,
      };
    });

    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Incorrect current password");
    });
  });

  it("does not submit form when validation errors exist", async () => {
    validateChangePassword.mockReturnValue({
      currPassword: CHANGE_PASSWORD.currRequired,
    });

    render(<ChangePassword isGuest={false} />);
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(makeRequestMock).not.toHaveBeenCalled();
    });
  });

  it("prevents form submission if user is guest", () => {
    render(<ChangePassword isGuest={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
