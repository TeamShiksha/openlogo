import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignInForm from "../../../src/components/auth/Signin";

describe("SignInForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    render(<SignInForm toggleForm={vi.fn()} onClose={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: /go to dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\?/i)).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<SignInForm toggleForm={vi.fn()} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText(/×/i));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("toggles to sign-up form when link is clicked", () => {
    const toggleFormMock = vi.fn();
    render(<SignInForm toggleForm={toggleFormMock} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/don't have an account\?/i));
    expect(toggleFormMock).toHaveBeenCalled();
  });
});
