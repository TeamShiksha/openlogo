import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

    const authModalDialog = screen.getByText(BUTTON_TEXT.cross);
    expect(authModalDialog).toBeInTheDocument();
  });

  it("Toggle between to Signup and Signin", async () => {
    render(<AuthModal isOpen={true} onClose={closeModal} />);

    const toggleSpan = screen.getByText(SIGNIN.footerText);
    fireEvent.click(toggleSpan);

    await waitFor(
      () => {
        const SignUpForm = screen.getByText(BUTTON_TEXT.signUp);
        expect(SignUpForm).toBeInTheDocument();
      },
      { timeout: 400 }
    );
  });

  it("AuthModal closes when cross is clicked", () => {
    const Close = vi.fn();
    render(<AuthModal isOpen={true} onClose={Close} />);

    const AuthModalcross = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(AuthModalcross);
    expect(Close).toHaveBeenCalled();
  });
});
