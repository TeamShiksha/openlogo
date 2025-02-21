import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, vi } from "vitest";
import SignUpForm from "../src/components/auth/Signup";

describe("SignUpForm UI and Functionality Tests", () => {
  test("renders all form elements correctly", () => {
    render(<SignUpForm toggleForm={vi.fn()} onClose={vi.fn()} />);
    expect(
      screen.getByRole("heading", { name: /sign up for free/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/already have an account\?/i)).toBeInTheDocument();
  });

  test("closes modal when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<SignUpForm toggleForm={vi.fn()} onClose={onCloseMock} />);
    fireEvent.click(screen.getByText(/×/i));
    expect(onCloseMock).toHaveBeenCalled();
  });

  test("toggles to sign-in form when link is clicked", () => {
    const toggleFormMock = vi.fn();
    render(<SignUpForm toggleForm={toggleFormMock} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText(/already have an account\?/i));
    expect(toggleFormMock).toHaveBeenCalled();
  });

  test("removes non-letter characters from name input", () => {
    render(<SignUpForm toggleForm={vi.fn()} onClose={vi.fn()} />);
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: "John123Doe!" } });
    expect(nameInput.value).toBe("JohnDoe");
  });

  test("handles form submission with valid data", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    render(<SignUpForm toggleForm={vi.fn()} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "ValidPass123!" },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: "ValidPass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({});
    });
  });
});
