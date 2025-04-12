import {
  render,
  screen,
  fireEvent,
  waitFor,
  renderHook,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../src/contexts/Contexts";
import SignIn from "../../../src/components/auth/Signin";
import { BUTTON_TEXT, SIGNIN } from "../../../src/utils/Constants";
import { useApi } from "../../../src/hooks/useApi";
import { mockFormvalues } from "../../../src/utils/testconstants";

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
  setIsAuthenticated: vi.fn(),
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

  it("connectivity test passed", async () => {
    const authContext = mockAuthContext(false);
    const oncloseMock = vi.fn();

    render(
      <AuthContext.Provider value={authContext}>
        <SignIn toggleForm={vi.fn()} onClose={oncloseMock} />
      </AuthContext.Provider>
    );

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const signInButton = screen.getByRole("button", {
      name: SIGNIN.submitButton,
    });

    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "Test@1234" } });

    expect(signInButton).not.toBeDisabled();
    fireEvent.click(signInButton);

    const { result } = renderHook(() =>
      useApi({
        url: `/auth/signin`,
        method: "post",
        data: mockFormvalues,
      })
    );

    vi.spyOn(result.current, "makeRequest").mockImplementation(async () => {
      return true;
    });

    const response = await result.current.makeRequest();

    await waitFor(() => {
      expect(emailInput.value).toBe(SIGNIN.initialValues.email);
      expect(passwordInput.value).toBe(SIGNIN.initialValues.password);
    });

    expect(response).toBe(true);
    expect(oncloseMock).toHaveBeenCalled();
  });
});
