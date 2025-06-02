import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import ContactForm from "../../../src/components/contact/ContactForm";
import { BUTTON_TEXT, CONTACT } from "../../../src/utils/Constants";
import { expect, it, describe, vi, beforeEach } from "vitest";
import { ToastProvider } from "../../../src/contexts/ToastContext";

const mockMakeRequest = vi.fn();
const mockLoading = vi.fn();
const mockIsSuccess = vi.fn();

vi.mock("../../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockMakeRequest,
    loading: mockLoading(),
    isSuccess: mockIsSuccess(),
    errorMsg: "An error occurred",
    data: {
      message: "Form submitted, our team will get in touch shortly",
    },
  }),
}));

const fillFormWithValidData = async () => {
  const nameInput = screen.getByLabelText("Name");
  const emailInput = screen.getByLabelText("Email");
  const messageInput = screen.getByPlaceholderText(
    "Type your message here ...."
  );

  await act(async () => {
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, {
      target: {
        value: "This is a test message that is long enough for validation",
      },
    });
  });

  return { nameInput, emailInput, messageInput };
};

beforeEach(() => {
  vi.clearAllMocks();
  mockLoading.mockReturnValue(false);
  mockIsSuccess.mockReturnValue(false);
});

describe("ContactForm Component", () => {
  it("renders the ContactForm with heading and input fields", () => {
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );

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

  describe("shows validation errors for input fields", () => {
    it("shows validation error for empty name field", async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );

      const nameInput = screen.getByLabelText("Name");
      fireEvent.focus(nameInput);
      await waitFor(() => {
        const nameError = screen.getByText("Name is required");
        expect(nameError).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: "John Doe" } });
      });
      await waitFor(() => {
        const nameError = screen.queryByText("Name is required");
        expect(nameError).not.toBeInTheDocument();
      });
    });

    it("shows validation error for empty email field", async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );

      const emailInput = screen.getByLabelText("Email");
      await act(async () => {
        fireEvent.focus(emailInput);
      });
      await waitFor(() => {
        const emailError = screen.getByText("Email is required");
        expect(emailError).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.blur(emailInput);
      });
    });

    it("shows validation error for invalid email format", async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );

      const emailInput = screen.getByLabelText("Email");
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.focus(emailInput);
        fireEvent.blur(emailInput);
      });
      await waitFor(() => {
        const emailError = screen.getByText("This is not a valid email format");
        expect(emailError).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.change(emailInput, {
          target: { value: "valid@example.com" },
        });
        fireEvent.focus(emailInput);
        fireEvent.blur(emailInput);
      });
      await waitFor(() => {
        const emailError = screen.queryByText(
          "This is not a valid email format"
        );
        expect(emailError).not.toBeInTheDocument();
      });
    });

    it("shows validation error for empty message field", async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );

      const messageInput = screen.getByPlaceholderText(
        "Type your message here ...."
      );
      await act(async () => {
        fireEvent.focus(messageInput);
      });
      await waitFor(() => {
        const messageError = screen.getByText("Message is required");
        expect(messageError).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.blur(messageInput);
      });
    });

    it("shows validation error for short message", async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );

      const errorMessage = "Message should be at least 20 characters";
      const messageInput = screen.getByPlaceholderText(
        "Type your message here ...."
      );
      await act(async () => {
        fireEvent.change(messageInput, { target: { value: "Too short" } });
        fireEvent.focus(messageInput);
        fireEvent.blur(messageInput);
      });
      await waitFor(() => {
        const messageError = screen.getByText(errorMessage);
        expect(messageError).toBeInTheDocument();
      });

      await act(async () => {
        fireEvent.change(messageInput, {
          target: {
            value:
              "This is a longer message that meets the minimum character requirement",
          },
        });
        fireEvent.focus(messageInput);
        fireEvent.blur(messageInput);
      });

      await waitFor(() => {
        const messageError = screen.queryByText(errorMessage);
        expect(messageError).not.toBeInTheDocument();
      });
    });
  });

  it("enables submit button only when form is valid", async () => {
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });

    expect(submitButton).toBeDisabled();

    await fillFormWithValidData();
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    const emailInput = screen.getByLabelText("Email");
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it("shows loading state while submitting the form", async () => {
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );

    await fillFormWithValidData();
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await act(async () => {
      mockLoading.mockReturnValue(true);
    });
    await act(async () => {
      render(
        <ToastProvider>
          <ContactForm closeModal={() => {}} />
        </ToastProvider>
      );
    });
    await waitFor(() => {
      expect(screen.getByText("Sending")).toBeInTheDocument();
      expect(screen.getByText("Sending")).toBeDisabled();
    });
  });

  it("shows success message when form is submitted successfully", async () => {
    mockMakeRequest.mockResolvedValue(true);
    mockIsSuccess.mockReturnValue(true);
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );

    await fillFormWithValidData();
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      expect(
        screen.getAllByText(
          "Form submitted, our team will get in touch shortly"
        ).length
      ).toBeGreaterThan(0);
    });
  });

  it("shows error message when form submission fails", async () => {
    mockMakeRequest.mockResolvedValue(false);
    mockIsSuccess.mockReturnValue(false);
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );

    await fillFormWithValidData();
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await act(async () => {
      fireEvent.click(submitButton);
    });
    await waitFor(() => {
      const errorElement = screen.getByText(
        "Form already submitted, try again later"
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  it("calls closeModal after successful submission and timeout", async () => {
    vi.useFakeTimers();
    const mockCloseModal = vi.fn(() => {});
    mockMakeRequest.mockResolvedValue(true);
    mockIsSuccess.mockReturnValue(true);
    render(
      <ToastProvider>
        <ContactForm closeModal={mockCloseModal} />
      </ToastProvider>
    );

    await fillFormWithValidData();
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("clears form after successful submission", async () => {
    vi.useFakeTimers();
    mockMakeRequest.mockResolvedValue(true);
    mockIsSuccess.mockReturnValue(true);
    render(
      <ToastProvider>
        <ContactForm closeModal={() => {}} />
      </ToastProvider>
    );

    const { nameInput, emailInput, messageInput } =
      await fillFormWithValidData();
    const submitButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendMessage,
    });
    await act(async () => {
      fireEvent.click(submitButton);
    });
    await act(async () => {
      vi.advanceTimersByTime(3000);
    });

    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(messageInput.value).toBe("");
    vi.useRealTimers();
  });
});
