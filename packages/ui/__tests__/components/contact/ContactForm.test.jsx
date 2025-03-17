import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "../../../src/components/contact/ContactForm";
import { BUTTON_TEXT, CONTACT } from "../../../src/utils/Constants";
import { expect, it, describe } from "vitest";

describe("ContactForm Component", () => {
  it("renders the ContactForm with heading and input fields", () => {
    render(<ContactForm closeModal={() => {}} />);

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type your message here ....")
    ).toBeInTheDocument();
  });

  it("renders the disabled submit button", () => {
    render(<ContactForm closeModal={() => {}} />);
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("renders the close button", () => {
    render(<ContactForm closeModal={() => {}} />);
    const closeButton =
      screen.getByRole("button", { name: BUTTON_TEXT.cross }) ||
      screen.getByText(BUTTON_TEXT.cross);
    expect(closeButton).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    let isOpen = true;
    const closeModal = () => {
      isOpen = false;
    };
    render(<ContactForm closeModal={closeModal} />);
    const closeButton = screen.getByRole("button", { name: BUTTON_TEXT.cross });
    fireEvent.click(closeButton);
    expect(isOpen).toBe(false);
  });

  it("closes the modal when clicking outside", () => {
    let isOpen = true;
    const closeModal = () => {
      isOpen = false;
    };

    render(<ContactForm closeModal={closeModal} />);

    const modalOverlay = screen.getByTestId("modal-overlay");
    expect(modalOverlay).toBeInTheDocument();

    fireEvent.click(modalOverlay);
    expect(isOpen).toBe(false);
  });

  it("shows validation errors when fields are empty after focus", async () => {
    render(<ContactForm closeModal={() => {}} />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const messageInput = screen.getByPlaceholderText(
      "Type your message here ...."
    );

    fireEvent.focus(nameInput);
    await waitFor(() => {
      const nameError = screen.getByText("Name is required!");
      expect(nameError).toBeInTheDocument();
    });
    fireEvent.blur(nameInput);

    fireEvent.focus(emailInput);
    await waitFor(() => {
      const emailError = screen.getByText("Email is required!");
      expect(emailError).toBeInTheDocument();
    });
    fireEvent.blur(emailInput);

    fireEvent.focus(messageInput);
    await waitFor(() => {
      const messageError = screen.getByText("Message is required!");
      expect(messageError).toBeInTheDocument();
    });
    fireEvent.blur(messageInput);

    await waitFor(() => {
      const nameError = screen.queryByText("Name is required!");
      expect(nameError).not.toBeInTheDocument();
      const emailError = screen.queryByText("Email is required!");
      expect(emailError).not.toBeInTheDocument();
      const messageError = screen.queryByText("Message is required!");
      expect(messageError).not.toBeInTheDocument();
    });
  });

  it("resets form correctly after submission", async () => {
    render(<ContactForm closeModal={() => {}} />);

    const nameInput = screen.getByLabelText("Name");
    const emailInput = screen.getByLabelText("Email");
    const messageInput = screen.getByPlaceholderText(
      "Type your message here ...."
    );
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });

    expect(submitButton).toBeDisabled();

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, {
      target: { value: "Hello this is a test message" },
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue(CONTACT.intialValues.name);
      expect(emailInput).toHaveValue(CONTACT.intialValues.email);
      expect(messageInput).toHaveValue(CONTACT.intialValues.message);
    });
    const nameError = screen.queryByText("Name is required!");
    expect(nameError).not.toBeInTheDocument();
    const emailError = screen.queryByText("Email is required!");
    expect(emailError).not.toBeInTheDocument();
    const messageError = screen.queryByText("Message is required!");
    expect(messageError).not.toBeInTheDocument();

    expect(submitButton).toBeDisabled();
    expect(document.activeElement).toBe(document.body);
  });
});
