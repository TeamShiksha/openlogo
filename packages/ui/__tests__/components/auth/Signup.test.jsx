import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignUpForm from "../../../src/components/auth/Signup";
import {
  SIGNUP,
  PASSWORD_VALIDATION_MESSAGES,
} from "../../../src/utils/Constants";
import * as apimodule from "../../../src/hooks/useApi";

describe("SignUpForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    render(<SignUpForm toggleForm={vi.fn()} />);

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
    render(<SignUpForm toggleForm={toggleFormMock} />);

    const switchButton = screen.getByText(SIGNUP.footerText);
    fireEvent.click(switchButton);
    expect(toggleFormMock).toHaveBeenCalled();
  });

  it("removes non-letter characters from name input", () => {
    render(<SignUpForm toggleForm={vi.fn()} />);

    const nameInput = screen.getByLabelText(SIGNUP["fields"][0].label);
    fireEvent.change(nameInput, { target: { value: "JohnDoe" } });
    expect(nameInput.value).toBe("JohnDoe");
  });

  it("validates only when focused and blurred", async () => {
    render(<SignUpForm toggleForm={vi.fn()} />);
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

  it("resets form correctly after submission", async () => {
    render(<SignUpForm toggleForm={vi.fn()} />);
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    const signUpButton = screen.getByRole("button", {
      name: SIGNUP.submitButton,
    });

    expect(signUpButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "xyz@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password@123" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "Password@123" },
    });

    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(nameInput.value).toBe(SIGNUP.initialValues.name);
      expect(emailInput.value).toBe(SIGNUP.initialValues.email);
      expect(passwordInput.value).toBe(SIGNUP.initialValues.password);
      expect(confirmPasswordInput.value).toBe(
        SIGNUP.initialValues.confirmPassword
      );
    });

    const nameError = screen.queryByText("Name is required!");
    expect(nameError).not.toBeInTheDocument();
    const emailError = screen.queryByText("Email is required");
    expect(emailError).not.toBeInTheDocument();
    const passwordError = screen.queryByText(
      PASSWORD_VALIDATION_MESSAGES.required
    );
    expect(passwordError).not.toBeInTheDocument();
    const confirmPasswordError = screen.queryByText(
      "Confirm password is required!"
    );
    expect(confirmPasswordError).not.toBeInTheDocument();

    expect(signUpButton).toBeDisabled();
    expect(document.activeElement).toBe(document.body);
  });
  it("connectivity test passed", async () => {
    const makeRequestMock = vi.fn().mockResolvedValue(true);
    vi.spyOn(apimodule, "useApi").mockReturnValue({
      makeRequest: makeRequestMock,
    });
    render(<SignUpForm toggleForm={vi.fn()} />);

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
      expect(nameInput.value).toBe(SIGNUP.initialValues.name);
      expect(emailInput.value).toBe(SIGNUP.initialValues.email);
      expect(passwordInput.value).toBe(SIGNUP.initialValues.password);
      expect(confirmPasswordInput.value).toBe(
        SIGNUP.initialValues.confirmPassword
      );
    });

    await waitFor(() => {
      expect(makeRequestMock).toHaveBeenCalled();
    });
    expect(signUpButton).toBeDisabled();
  });
  it("connectivity test failed", async () => {
    const makeRequestMock = vi.fn().mockResolvedValue(false);
    vi.spyOn(apimodule, "useApi").mockReturnValue({
      makeRequest: makeRequestMock,
    });

    render(<SignUpForm toggleForm={vi.fn()} />);

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
      expect(nameInput.value).toBe(SIGNUP.initialValues.name);
      expect(emailInput.value).toBe(SIGNUP.initialValues.email);
      expect(passwordInput.value).toBe(SIGNUP.initialValues.password);
      expect(confirmPasswordInput.value).toBe(
        SIGNUP.initialValues.confirmPassword
      );
    });

    await waitFor(() => {
      expect(makeRequestMock).toHaveBeenCalled();
    });
    expect(signUpButton).toBeDisabled();
  });
});
