import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignUpForm from "../../../src/components/auth/Signup";
import { SIGNUP, BUTTON_TEXT } from "../../../src/utils/Constants";

describe("SignUpForm UI and Functionality Tests", () => {
  it("renders all form elements correctly", () => {
    render(<SignUpForm toggleForm={vi.fn()} onClose={vi.fn()} />);

    const title = screen.getByRole("heading", { name: SIGNUP.title });
    expect(title).toBeInTheDocument();
    for (const item of SIGNUP["fields"]) {
      const label = screen.getByLabelText(item.label);
      expect(label).toBeInTheDocument();
    }
    const footerText = screen.getByText(SIGNUP.footerText);
    expect(footerText).toBeInTheDocument();
  });

  it("closes modal when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<SignUpForm toggleForm={vi.fn()} onClose={onCloseMock} />);

    const closeButton = screen.getByText(BUTTON_TEXT.cross);
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("switch to to sign-in form on click", () => {
    const toggleFormMock = vi.fn();
    render(<SignUpForm toggleForm={toggleFormMock} onClose={vi.fn()} />);

    const switchButton = screen.getByText(SIGNUP.footerText);
    fireEvent.click(switchButton);
    expect(toggleFormMock).toHaveBeenCalled();
  });

  it("removes non-letter characters from name input", () => {
    render(<SignUpForm toggleForm={vi.fn()} onClose={vi.fn()} />);

    const nameInput = screen.getByLabelText(SIGNUP["fields"][0].label);
    fireEvent.change(nameInput, { target: { value: "John123Doe!" } });
    expect(nameInput.value).toBe("JohnDoe");
  });
});
