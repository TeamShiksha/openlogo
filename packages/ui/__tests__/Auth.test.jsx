import { render, screen, fireEvent } from "@testing-library/react";
import AuthModal from "../src/components/auth/Auth";
import { expect, describe, vi, it } from "vitest";

describe("Auth Component", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal when isOpen is true", () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("toggles to SignInForm when toggleForm is clicked", () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText("Already have an account?"));
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("closes modal when clicking outside", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalled();
  });

  it("closes modal when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
