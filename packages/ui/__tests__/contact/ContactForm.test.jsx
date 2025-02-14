import { describe, it, expect, vi } from "vitest";
import ContactForm from "../../src/components/contact/ContactForm";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// Mock CustomInput and Button components
vi.mock("../../src/components/common/input/CustomInput", () => ({
  __esModule: true,
  default: ({ label, ...props }) => <input aria-label={label} {...props} />,
}));

vi.mock("../../src/components/common/button/Button", () => ({
  __esModule: true,
  default: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe("ContactForm", () => {
  it("should render the form correctly", () => {
    render(<ContactForm closeModal={vi.fn()} />);

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message here ....")
    ).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("should validate form fields and displays errors", async () => {
    render(<ContactForm closeModal={vi.fn()} />);

    fireEvent.click(screen.getByText("Send Message"));

    expect(await screen.findByText("Name is required.")).toBeInTheDocument();
    expect(await screen.findByText("Email is required.")).toBeInTheDocument();
    expect(await screen.findByText("Message is required.")).toBeInTheDocument();
  });

  it("should validate email format", async () => {
    render(<ContactForm closeModal={vi.fn()} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText("Send Message"));

    await waitFor(() => {
      expect(screen.getByText("Enter a valid email address.")).toBeVisible();
    });
  });

  it("should submit the form successfully", async () => {
    const closeModal = vi.fn();
    render(<ContactForm closeModal={closeModal} />);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Type your message here ...."),
      {
        target: { value: "Hello!" },
      }
    );
    fireEvent.click(screen.getByText("Send Message"));

    expect(
      await screen.findByText("Message sent successfully!")
    ).toBeInTheDocument();
    setTimeout(() => {
      expect(closeModal).toHaveBeenCalled();
    }, 5000);
  });
});
