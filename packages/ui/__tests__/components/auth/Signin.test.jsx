import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

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

  it("does not show an error for password but still validates it", async () => {
    const authContext = mockAuthContext(false);
    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} />
      </AuthContext.Provider>
    );
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.focus(passwordInput);
    fireEvent.change(passwordInput, { target: { value: "short" } });
    fireEvent.blur(passwordInput);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("Resets form correctly after submission", async () => {
    const authContext = mockAuthContext(false);
    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} onClose={vi.fn()} />
      </AuthContext.Provider>
    );
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", {
      name: BUTTON_TEXT.signIn,
    });

    expect(signInButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "ValidPassword@123" } });

    await waitFor(() => {
      expect(signInButton).toBeEnabled();
    });

    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(emailInput).toHaveValue(SIGNIN.initialValues.email);
      expect(passwordInput).toHaveValue(SIGNIN.initialValues.password);
    });
    const emailError = screen.queryByText("Email is required");
    expect(emailError).not.toBeInTheDocument();

    expect(signInButton).toBeDisabled();
    expect(document.activeElement).toBe(document.body);
  });
});
