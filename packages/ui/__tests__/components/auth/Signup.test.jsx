import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import SignUpForm from "../../../src/components/auth/Signup";
import {
  SIGNUP,
  PASSWORD_VALIDATION_MESSAGES,
} from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "../../../src/contexts/Contexts";
import { ToastProvider } from "../../../src/contexts/ToastContext";

const mockedMakeRequest = vi.fn();
vi.mock("../../src/hooks/useApi.js", () => ({
  useApi: () => ({
    makeRequest: mockedMakeRequest,
    errorMsg: "Email already exists.",
  }),
}));

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
  setIsAuthenticated: vi.fn(),
});

describe("SignUpForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const title = screen.getByRole("heading", { name: SIGNUP.title });
    expect(title).toBeInTheDocument();
    for (const item of SIGNUP["fields"]) {
      const label = screen.getByLabelText(item.label);
      expect(label).toBeInTheDocument();
    }
    const footerText = screen.getByText(SIGNUP.footerText);
    expect(footerText).toBeInTheDocument();
  });

  it("switch to to sign-in form on click", () => {
    const toggleFormMock = vi.fn();
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={toggleFormMock} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const switchButton = screen.getByText(SIGNUP.footerText);
    fireEvent.click(switchButton);
    expect(toggleFormMock).toHaveBeenCalled();
  });

  it("removes non-letter characters from name input", () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(SIGNUP["fields"][0].label);
    fireEvent.change(nameInput, { target: { value: "JohnDoe" } });
    expect(nameInput.value).toBe("JohnDoe");
  });

  it("validates only when focused and blurred", async () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.focus(nameInput);
    await waitFor(() => {
      const nameError = screen.getByText("Name is required");
      expect(nameError).toBeInTheDocument();
    });
    fireEvent.blur(nameInput);

    fireEvent.focus(emailInput);
    await waitFor(() => {
      const emailError = screen.getByText("Email is required");
      expect(emailError).toBeInTheDocument();
    });
    fireEvent.blur(emailInput);

    fireEvent.focus(passwordInput);
    await waitFor(() => {
      const passwordError = screen.getByText(
        PASSWORD_VALIDATION_MESSAGES.required
      );
      expect(passwordError).toBeInTheDocument();
      fireEvent.blur(passwordInput);
      expect(
        screen.queryByText(PASSWORD_VALIDATION_MESSAGES.required)
      ).not.toBeInTheDocument();
    });
  });

  it.skip("does not reset form after failed submission", async () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signUpButton = screen.getByRole("button", {
      name: SIGNUP.submitButton,
    });

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "testuser@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password@123" },
    });

    expect(signUpButton).toBeEnabled();

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });

    expect(nameInput.value).toBe("Test User");
    expect(emailInput.value).toBe("testuser@example.com");
    expect(passwordInput.value).toBe("Password@123");
    expect(confirmPasswordInput.value).toBe("Password@123");

    expect(signUpButton).toBeEnabled();
  });

  it.skip("connectivity test passed", async () => {
    const authContext = mockAuthContext(true);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signUpButton = screen.getByRole("button", {
      name: SIGNUP.submitButton,
    });

    expect(signUpButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test@1234" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Test@1234" } });

    expect(signUpButton).not.toBeDisabled();
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });
  });

  it.skip("connectivity test failed", async () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signUpButton = screen.getByRole("button", {
      name: SIGNUP.submitButton,
    });

    expect(signUpButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test@1234" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Test@1234" } });

    expect(signUpButton).not.toBeDisabled();
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(nameInput.value).toBe("Test");
      expect(emailInput.value).toBe("test@gmail.com");
      expect(passwordInput.value).toBe("Test@1234");
      expect(confirmPasswordInput.value).toBe("Test@1234");
    });

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });
    expect(signUpButton).not.toBeDisabled();
  });

  const delayedResolve = () =>
    new Promise((resolve) => setTimeout(() => resolve(true), 1000));

  beforeEach(() => {
    mockedMakeRequest.mockImplementation(delayedResolve);
  });

  it("disables input fields and submit button when loading", async () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <ToastProvider>
            <SignUpForm toggleForm={vi.fn()} />
          </ToastProvider>
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const submitButton = screen.getByRole("button", {
      name: SIGNUP.submitButton,
    });

    fireEvent.change(nameInput, { target: { value: "Test" } });
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test@1234" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "Test@1234" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toBeDisabled();
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(confirmPasswordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
