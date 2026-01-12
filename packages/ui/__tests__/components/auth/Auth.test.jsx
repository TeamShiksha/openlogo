import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthModal from "../../../src/components/auth/Auth";
import { expect, describe, vi, it, beforeEach } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../../../src/contexts/ToastContext.jsx";
import { ThemeProvider } from "../../../src/contexts/ThemeContext";

const closeModal = vi.fn();
const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe("Auth Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });
  it("Authmodal doesn't render if isOpen = false", () => {
    const { container } = render(
      <BrowserRouter>
        <AuthModal isOpen={false} onClose={closeModal} />
      </BrowserRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("Authmodal does render if isOpen = true", () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ThemeProvider>
            <ToastProvider>
              <AuthModal isOpen={true} onClose={closeModal} />
            </ToastProvider>
          </ThemeProvider>
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
          <ThemeProvider>
            <ToastProvider>
              <AuthModal isOpen={true} onClose={closeModal} />
            </ToastProvider>
          </ThemeProvider>
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
      { timeout: 1000 }
    );
  });

  it("AuthModal closes when cross is clicked", () => {
    const authContext = mockAuthContext(true);
    const Close = vi.fn();
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ThemeProvider>
            <ToastProvider>
              <AuthModal isOpen={true} onClose={Close} />
            </ToastProvider>
          </ThemeProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const AuthModalcross = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(AuthModalcross);
    expect(Close).toHaveBeenCalled();
  });
});
