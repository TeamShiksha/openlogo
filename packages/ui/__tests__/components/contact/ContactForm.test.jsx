import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "../../../src/components/contact/ContactForm";
import { BUTTON_TEXT, CONTACT } from "../../../src/utils/Constants";
import { expect, it, describe } from "vitest";

describe("ContactForm Component", () => {
  it("renders the ContactForm with heading and input fields", () => {
    render(<ContactForm closeModal={() => {}} />);

    const title = screen.getByText(CONTACT.title);
    expect(title).toBeInTheDocument();
    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();
    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    const messageInput = screen.getByPlaceholderText(
      "Type your message here ...."
    );
    expect(messageInput).toBeInTheDocument();
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

    fireEvent.focus(messageInput);
    await waitFor(() => {
      const messageError = screen.getByText("Message is required");
      expect(messageError).toBeInTheDocument();
    });
    fireEvent.blur(messageInput);

    await waitFor(() => {
      const nameError = screen.queryByText("Name is required");
      expect(nameError).not.toBeInTheDocument();
      const emailError = screen.queryByText("Email is required");
      expect(emailError).not.toBeInTheDocument();
      const messageError = screen.queryByText("Message is required");
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
    const nameError = screen.queryByText("Name is required");
    expect(nameError).not.toBeInTheDocument();
    const emailError = screen.queryByText("Email is required");
    expect(emailError).not.toBeInTheDocument();
    const messageError = screen.queryByText("Message is required");
    expect(messageError).not.toBeInTheDocument();

    expect(submitButton).toBeDisabled();
    expect(document.activeElement).toBe(document.body);
  });
});
