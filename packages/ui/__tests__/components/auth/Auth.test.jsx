import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthModal from "../../../src/components/auth/Auth";
import { expect, describe, vi, it } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";

const closeModal = vi.fn();

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

describe("Auth Component", () => {
  it("Authmodal doesn't render if isOpen = false", () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={closeModal} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Authmodal does render if isOpen = true", () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <AuthModal isOpen={true} onClose={closeModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const authModalDialog = screen.getByText(BUTTON_TEXT.cross);
    expect(authModalDialog).toBeInTheDocument();
  });

  it("Toggle between to Signup and Signin", async () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <AuthModal isOpen={true} onClose={closeModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

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
    const authContext = mockAuthContext(true);
    const Close = vi.fn();
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <AuthModal isOpen={true} onClose={Close} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const AuthModalcross = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(AuthModalcross);
    expect(Close).toHaveBeenCalled();
  });
});
