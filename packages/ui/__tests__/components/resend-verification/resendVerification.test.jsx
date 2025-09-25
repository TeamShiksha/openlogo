import { vi } from "vitest";
vi.mock("react-router-dom", () => ({ useNavigate: () => vi.fn() }));
vi.mock("../../../src/hooks/useToast", () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));
vi.mock("../../../src/hooks/useApi", () => {
  let errorMsg = null;
  let data = null;
  return {
    useApi: () => ({
      makeRequest: vi.fn(() => {
        if (errorMsg) throw new Error(errorMsg);
        return Promise.resolve();
      }),
      data,
      errorMsg,
    }),
  };
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ResendVerification from "../../../src/page/resend-verification/ResendVerification";
import { BUTTON_TEXT } from "../../../src/utils/Constants";

describe("ResendVerification Page", () => {
  it("renders email field and resend button", () => {
    render(<ResendVerification />);
    expect(
      screen.getByLabelText(/resend Verifaction Email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: BUTTON_TEXT.resendEmail })
    ).toBeInTheDocument();
  });

  it("allows user to type email and click resend", () => {
    render(<ResendVerification />);
    const emailInput = screen.getByLabelText(/resend Verifaction Email/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const button = screen.getByRole("button", {
      name: BUTTON_TEXT.resendEmail,
    });
    fireEvent.click(button);
  });
});
