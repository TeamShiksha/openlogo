import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../../../src/contexts/ToastContext.jsx";

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
  setIsAuthenticated: vi.fn(),
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const mockedMakeRequest = vi.fn();
vi.mock("../../src/hooks/useApi.js", () => ({
  useApi: () => ({
    makeRequest: mockedMakeRequest,
    errorMsg: null,
  }),
}));

describe("SignInForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

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
    const authContext = mockAuthContext(false);
    const toggleForm = vi.fn();
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={toggleForm} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const closeButton = screen.getByText(SIGNIN.footerText);
    fireEvent.click(closeButton);
    expect(toggleForm).toHaveBeenCalled();
  });

  it("validates email only when focused and blurred", async () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText("Email");

    fireEvent.focus(emailInput);
    await waitFor(() => {
      const emailError = screen.getByText("Email is required");
      expect(emailError).toBeInTheDocument();
    });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      const emailError = screen.queryByText("Email is required");
      expect(emailError).not.toBeInTheDocument();
    });
  });

  it.skip("connectivity test passed", async () => {
    const authContext = mockAuthContext(false);
    const oncloseMock = vi.fn();

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={vi.fn()} onClose={oncloseMock} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "johndoe1@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: BUTTON_TEXT.signIn }));

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });

    expect(oncloseMock).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it.skip("connectivity test failed", async () => {
    const authContext = mockAuthContext(false);
    const errorMsg = "Incorrect email or password.";

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: BUTTON_TEXT.signIn }));

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });

    const errorMsgText = screen.getAllByText(errorMsg);
    errorMsgText.forEach((msg) => expect(msg).toBeInTheDocument());
  });

  const delayedResolve = () =>
    new Promise((resolve) => setTimeout(() => resolve(true), 1000));
  let authContext;

  beforeEach(() => {
    authContext = mockAuthContext(false);
    mockedMakeRequest.mockImplementation(delayedResolve);
  });

  it("disables input fields and submit button when loading", async () => {
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignIn toggleForm={vi.fn()} onClose={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.signIn,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
  it("switches to forgot password mode when forgot password link is clicked", () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <ToastProvider>
          <SignIn toggleForm={vi.fn()} />
        </ToastProvider>
      </AuthContext.Provider>
    );

    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });
    expect(submitButton).toBeInTheDocument();

    const backToSignInLink = screen.getByText("Back to Sign In");
    expect(backToSignInLink).toBeInTheDocument();
  });
  it("switches back to sign in mode when 'Back to Sign In' is clicked", async () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <ToastProvider>
          <SignIn toggleForm={vi.fn()} />
        </ToastProvider>
      </AuthContext.Provider>
    );

    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    const backToSignInLink = screen.getByText("Back to Sign In");
    fireEvent.click(backToSignInLink);

    const passwordField = screen.getByLabelText("Password");
    expect(passwordField).toBeInTheDocument();

    const signInButton = screen.getByRole("button", {
      name: BUTTON_TEXT.signIn,
    });
    expect(signInButton).toBeInTheDocument();
  });

  it("validates email in forgot password mode", async () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <ToastProvider>
          <SignIn toggleForm={vi.fn()} />
        </ToastProvider>
      </AuthContext.Provider>
    );
    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.focus(emailInput);

    await waitFor(() => {
      const emailError = screen.getByText("Email is required");
      expect(emailError).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  });

  it("validates forgot password form prevents submission with invalid email", async () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <ToastProvider>
          <SignIn toggleForm={vi.fn()} />
        </ToastProvider>
      </AuthContext.Provider>
    );
    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);

    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.submit,
    });
    expect(submitButton).toBeDisabled();
  });
});
