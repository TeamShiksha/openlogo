import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ChangePassword from "../../src/components/changepassword/ChangePassword";
import {
  BUTTON_TEXT,
  CHANGE_PASSWORD_FIELDS,
  MESSAGES,
} from "../../src/utils/Constants";
import * as useApiHook from "../../src/hooks/useApi";

const mockMakeRequest = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    errorMsg: null,
    loading: false,
  }),
}));

vi.mock("../../src/hooks/useToast", () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}));

const getInputs = () => ({
  currPassword: screen.getByPlaceholderText(CHANGE_PASSWORD_FIELDS[0].label),
  newPassword: screen.getByPlaceholderText(CHANGE_PASSWORD_FIELDS[1].label),
});

const getSubmitButton = () =>
  screen.getByRole("button", { name: BUTTON_TEXT.changePasswordLabel });

describe("ChangePassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders password inputs and submit button", () => {
    render(<ChangePassword isGuest={false} />);
    CHANGE_PASSWORD_FIELDS.forEach((field) => {
      expect(screen.getByPlaceholderText(field.label)).toBeInTheDocument();
    });
    expect(getSubmitButton()).toBeInTheDocument();
  });

  it("shows validation error after focusing a field", async () => {
    render(<ChangePassword isGuest={false} />);
    const { currPassword } = getInputs();
    fireEvent.focus(currPassword);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it("disables submit button when loading", () => {
    vi.spyOn(useApiHook, "useApi").mockReturnValueOnce({
      makeRequest: mockMakeRequest,
      errorMsg: null,
      loading: true,
    });

    render(<ChangePassword isGuest={false} />);
    expect(getSubmitButton()).toBeDisabled();
  });

  it("submits form and shows success toast on success", async () => {
    mockMakeRequest.mockResolvedValue(true);
    render(<ChangePassword isGuest={false} />);

    const { currPassword, newPassword } = getInputs();
    fireEvent.change(currPassword, { target: { value: "Oldpass@123" } });
    fireEvent.change(newPassword, { target: { value: "Newpass@123" } });

    await waitFor(() => {
      expect(getSubmitButton()).not.toBeDisabled();
    });

    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        MESSAGES.UPDATE_PASSWORD_SUCCESS
      );
    });
  });

  it("shows error toast when api returns errorMsg", async () => {
    vi.spyOn(useApiHook, "useApi").mockReturnValueOnce({
      makeRequest: mockMakeRequest,
      errorMsg: "Incorrect current password",
      loading: false,
    });

    render(<ChangePassword isGuest={false} />);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Incorrect current password");
    });
  });

  it("does not submit when validation errors exist", async () => {
    render(<ChangePassword isGuest={false} />);
    fireEvent.click(getSubmitButton());

    await waitFor(() => {
      expect(mockMakeRequest).not.toHaveBeenCalled();
    });
  });

  it("disables submit button for guest users", () => {
    render(<ChangePassword isGuest={true} />);
    expect(getSubmitButton()).toBeDisabled();
  });

  it("renders eye toggle buttons", () => {
    render(<ChangePassword isGuest={false} />);
    expect(
      screen.getByRole("button", { name: "Show Current Password" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show New Password" })
    ).toBeInTheDocument();
  });

  it("toggles current password visibility", () => {
    render(<ChangePassword isGuest={false} />);
    const { currPassword } = getInputs();

    fireEvent.click(
      screen.getByRole("button", { name: "Show Current Password" })
    );
    expect(currPassword).toHaveAttribute("type", "text");

    fireEvent.click(
      screen.getByRole("button", { name: "Hide Current Password" })
    );
    expect(currPassword).toHaveAttribute("type", "password");
  });

  it("toggles new password visibility", () => {
    render(<ChangePassword isGuest={false} />);
    const { newPassword } = getInputs();

    fireEvent.click(screen.getByRole("button", { name: "Show New Password" }));
    expect(newPassword).toHaveAttribute("type", "text");

    fireEvent.click(screen.getByRole("button", { name: "Hide New Password" }));
    expect(newPassword).toHaveAttribute("type", "password");
  });

  it("password visibility toggles independently", () => {
    render(<ChangePassword isGuest={false} />);
    const { currPassword, newPassword } = getInputs();

    fireEvent.click(
      screen.getByRole("button", { name: "Show Current Password" })
    );

    expect(currPassword).toHaveAttribute("type", "text");
    expect(newPassword).toHaveAttribute("type", "password");
  });

  it("eye buttons are not focusable via keyboard", () => {
    render(<ChangePassword isGuest={false} />);
    const buttons = screen.getAllByRole("button");
    const eyeButtons = buttons.filter((btn) =>
      btn.getAttribute("aria-label")?.includes("Password")
    );

    eyeButtons.forEach((btn) => {
      expect(btn.getAttribute("tabindex")).toBe("-1");
    });
  });
});
