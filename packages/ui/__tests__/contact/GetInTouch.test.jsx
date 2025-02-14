import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GetInTouch from "../../src/components/contact/GetInTouch";

// Mock Button and ContactForm components
vi.mock("../../src/components/common/button/Button", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("../../src/components/contact/ContactForm", () => ({
  __esModule: true,
  default: ({ closeModal }) => (
    <div data-testid="contact-form">
      <button onClick={closeModal}>Close</button>
    </div>
  ),
}));

describe("GetInTouch", () => {
  it("should render the GetInTouch component correctly", () => {
    render(<GetInTouch />);
    expect(screen.getByText("Still have questions?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Can't find the answer you're looking for? Please chat to our friendly team."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("should open the contact form modal when clicking 'Get in touch' button", async () => {
    render(<GetInTouch />);

    // Click the 'Get in touch' button
    fireEvent.click(screen.getByRole("button", { name: /get in touch/i }));

    // Wait for the modal to appear
    await waitFor(() => {
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });
  });

  it("should close the contact form modal when clicking 'Close' button", () => {
    render(<GetInTouch />);
    fireEvent.click(screen.getByText("Get in touch"));
    expect(screen.getByTestId("contact-form")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("contact-form")).not.toBeInTheDocument();
  });
});
