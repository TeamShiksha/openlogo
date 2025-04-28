import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
  setIsAuthenticated: vi.fn(),
});

const mockedMakeRequest = vi.fn();
vi.mock("../../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockedMakeRequest,
    errorMsg: "Incorrect email or password.",
  }),
}));

describe("SignInForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    const authContext = mockAuthContext(false);
    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
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
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={toggleForm} />
      </AuthContext.Provider>
    );

    const closeButton = screen.getByText(SIGNIN.footerText);
    fireEvent.click(closeButton);
    expect(toggleForm).toHaveBeenCalled();
  });

  it("validates email only when focused and blurred", async () => {
    const authContext = mockAuthContext(false);
    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
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

  it("connectivity test passed", async () => {
    const authContext = mockAuthContext(false);
    const oncloseMock = vi.fn();
    mockedMakeRequest.mockResolvedValue(true);

    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} onClose={oncloseMock} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "johndoe1@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: SIGNIN.submitButton }));

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });

    expect(oncloseMock).toHaveBeenCalled();
  });

  it("connectivity test failed", async () => {
    const authContext = mockAuthContext(false);
    mockedMakeRequest.mockResolvedValue(false);
    const errorMsg = "Incorrect email or password.";

    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: SIGNIN.submitButton }));

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  //tests for forgot password functionality

  it("switches to forgot password mode when forgot password link is clicked", () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
    );

    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();

    const submitButton = screen.getByRole("button", { name: "Submit" });
    expect(submitButton).toBeInTheDocument();

    const backToSignInLink = screen.getByText("Back to Sign In");
    expect(backToSignInLink).toBeInTheDocument();
  });

  it("switches back to sign in mode when 'Back to Sign In' is clicked", async () => {
    const authContext = mockAuthContext(false);

    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
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
        <SignIn toggleForm={vi.fn()} />
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
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
    );

    const forgotPasswordLink = screen.getByText(BUTTON_TEXT.forgotPassword);
    fireEvent.click(forgotPasswordLink);

    const emailInput = screen.getByLabelText("Email");
    fireEvent.change(emailInput, { target: { value: "" } });

    const submitButton = screen.getByRole("button", { name: "Submit" });
    fireEvent.click(submitButton);
  });
});
