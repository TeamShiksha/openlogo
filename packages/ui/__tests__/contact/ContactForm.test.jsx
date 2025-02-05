import { describe, it, expect, vi } from "vitest";
import ContactForm from "../../src/components/contact/ContactForm";
import { render, screen, fireEvent } from "@testing-library/react";

describe("ContactForm", () => {
  const closeModalMock = vi.fn();

  it("renders the contact form correctly", () => {
    render(<ContactForm closeModal={closeModalMock} />);
    expect(screen.getByText("Contact Us")).toBeVisible();
    expect(screen.getByLabelText("Name")).toBeVisible();
    expect(screen.getByLabelText("Email")).toBeVisible();
    expect(
      screen.getByPlaceholderText("Type your message here ....")
    ).toBeVisible();
    expect(screen.getByText("Send Message")).toBeVisible();
  });

  it("updates input fields correctly", () => {
    render(<ContactForm closeModal={closeModalMock} />);
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const messageInput = screen.getByPlaceholderText(
      "Type your message here ...."
    );

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Hello, this is a test message." },
    });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(messageInput).toHaveValue("Hello, this is a test message.");
  });

  //   it("displays validation errors for empty fields", () => {
  //     render(<ContactForm closeModal={closeModalMock} />);
  //     const submitButton = screen.getByText("Send Message");

  //     fireEvent.click(submitButton);

  //     expect(screen.getByText("Name is required.")).toBeVisible();
  //     expect(screen.getByText("Email is required.")).toBeVisible();
  //     expect(screen.getByText("Message is required.")).toBeVisible();
  //   });

  //   it("displays validation error for invalid email", () => {
  //     render(<ContactForm closeModal={closeModalMock} />);
  //     const emailInput = screen.getByLabelText("Email");
  //     const submitButton = screen.getByText("Send Message");

  //     fireEvent.change(emailInput, { target: { value: "invalid-email" } });
  //     fireEvent.click(submitButton);

  //     expect(screen.getByText("Enter a valid email address.")).toBeVisible();
  //   });

  it("submits the form successfully with valid data", () => {
    render(<ContactForm closeModal={closeModalMock} />);
    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const messageInput = screen.getByPlaceholderText(
      "Type your message here ...."
    );
    const submitButton = screen.getByText("Send Message");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Hello, this is a test message." },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText("Message sent successfully!")).toBeVisible();
  });

  it("closes the modal when clicking outside", () => {
    render(<ContactForm closeModal={closeModalMock} />);
    const modalOverlay = screen.getByRole("dialog");

    fireEvent.mouseDown(document.body);
    expect(closeModalMock).toHaveBeenCalled();
  });

  it("closes the modal when pressing the Escape key", () => {
    render(<ContactForm closeModal={closeModalMock} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeModalMock).toHaveBeenCalled();
  });
});
