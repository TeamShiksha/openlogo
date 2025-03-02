import { render, screen, fireEvent } from "@testing-library/react";
import AuthModal from "../../../src/components/auth/Auth";
import { expect, describe, vi, it } from "vitest";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";

const closeModal = vi.fn();

describe("Auth Component", () => {
  it("Authmodal doesn't render if isOpen = false", () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={closeModal} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Authmodal does render if isOpen = true", () => {
    render(<AuthModal isOpen={true} onClose={closeModal} />);

    const authModalDialog = screen.getByRole("dialog");
    expect(authModalDialog).toBeInTheDocument();
  });

  it("Toggle between to Signup and Signin", () => {
    render(<AuthModal isOpen={true} onClose={closeModal} />);

    const toggleSpan = screen.getByText(SIGNIN.footerText);
    fireEvent.click(toggleSpan);
    const SignInForm = screen.getByText(BUTTON_TEXT.signIn);
    expect(SignInForm).toBeInTheDocument();
  });

  it("AuthModal closes when clicking outside", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });
});
