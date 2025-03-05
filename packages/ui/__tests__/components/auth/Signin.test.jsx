import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";

describe("SignInForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    render(<SignIn toggleForm={vi.fn()} />);

    const title = screen.getByRole("heading", { name: SIGNIN.title });
    expect(title).toBeInTheDocument();
    for (const item of SIGNIN["fields"]) {
      const label = screen.getByLabelText(item.label);
      expect(label).toBeInTheDocument();
    }
    const forgotPassword = screen.getByText(BUTTON_TEXT.forgotPassword);
    expect(forgotPassword).toBeInTheDocument();
    const footerText = screen.getByText(SIGNIN.footerText);
    expect(footerText).toBeInTheDocument();
  });

  it("Change form when clicked on text in footer", () => {
    const toggleForm = vi.fn();
    render(<SignIn toggleForm={toggleForm} />);

    const closeButton = screen.getByText(SIGNIN.footerText);
    fireEvent.click(closeButton);
    expect(toggleForm).toHaveBeenCalled();
  });
});
