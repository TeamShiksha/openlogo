import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";
import { BrowserRouter } from "react-router-dom";

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
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <SignIn toggleForm={vi.fn()} />
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
          <SignIn toggleForm={toggleForm} />
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
          <SignIn toggleForm={vi.fn()} />
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

  it("connectivity test passed", async () => {
    const authContext = mockAuthContext(false);
    const oncloseMock = vi.fn();
    mockedMakeRequest.mockResolvedValue(true);

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <SignIn toggleForm={vi.fn()} onClose={oncloseMock} />
        </AuthContext.Provider>
      </BrowserRouter>
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
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("connectivity test failed", async () => {
    const authContext = mockAuthContext(false);
    mockedMakeRequest.mockResolvedValue(false);
    const errorMsg = "Incorrect email or password.";

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <SignIn toggleForm={vi.fn()} />
        </AuthContext.Provider>
      </BrowserRouter>
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

  it("disables input fields and submit button when loading", async () => {
    const authContext = mockAuthContext(false);
    mockedMakeRequest.mockImplementation(() => {
      return new Promise((resolve) => setTimeout(() => resolve(true), 1000));
    });

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <SignIn toggleForm={vi.fn()} onClose={vi.fn()} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.signIn,
    });

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });
    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
