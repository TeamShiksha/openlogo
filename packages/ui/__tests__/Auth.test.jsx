import { render, screen, fireEvent } from "@testing-library/react";
import AuthModal from "../src/components/auth/Auth";
import { expect, describe, vi } from "vitest";

describe("Auth Component", () => {
  test("renders nothing when isOpen is false", () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders modal when isOpen is true", () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  test("toggles to SignInForm when toggleForm is clicked", () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Already have an account?"));
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  test("closes modal when clicking outside", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  test("closes modal when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
