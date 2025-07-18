import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LogoRequestForm from "../../src/components/demo/LogoRequestForm";
import { BUTTON_TEXT, LOGOREQUEST } from "../../src/utils/Constants";
import { ToastProvider } from "../../src/contexts/ToastContext";

const mockMakeRequest = vi.fn();
const mockLoading = vi.fn();
const mockIsSuccess = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

const mockUseApi = vi.fn();

vi.mock("../../src/hooks/useApi", () => ({
  useApi: () => mockUseApi(),
}));

vi.mock("../../src/hooks/useToast", () => ({
  useToast: () => ({
    success: mockToastSuccess,
    error: mockToastError,
  }),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockLoading.mockReturnValue(false);
  mockIsSuccess.mockReturnValue(false);

  mockUseApi.mockReturnValue({
    makeRequest: mockMakeRequest,
    loading: mockLoading(),
    isSuccess: mockIsSuccess(),
    errorMsg: null,
    data: null,
  });
});

const fillFormWithValidData = async () => {
  const companyUrlInput = screen.getByLabelText("Company Url");
  const companyDescriptionInput = screen.getByPlaceholderText(
    "Type company description here ..."
  );

  await act(async () => {
    fireEvent.change(companyUrlInput, {
      target: { value: "https://validurl.com" },
    });
    fireEvent.change(companyDescriptionInput, {
      target: {
        value: "This is a test message that is long enough for validation",
      },
    });
  });

  return { companyUrlInput, companyDescriptionInput };
};

describe("LogoRequestForm", () => {
  it("renders the LogoRequestForm title and input fields", () => {
    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );
    const logoRequestTitle = screen.getByText(LOGOREQUEST.title);
    expect(logoRequestTitle).toBeInTheDocument();
    const companyUrlInput = screen.getByLabelText("Company Url");
    expect(companyUrlInput).toBeInTheDocument();
    const companyDescriptionInput = screen.getByPlaceholderText(
      "Type company description here ..."
    );
    expect(companyDescriptionInput).toBeInTheDocument();
  });

  describe("shows validation errors for input fields", () => {
    it("display validation error for empty company url", async () => {
      render(
        <ToastProvider>
          <LogoRequestForm closeModal={() => {}} />
        </ToastProvider>
      );
      const urlInput = screen.getByLabelText("Company Url");
      fireEvent.focus(urlInput);
      await waitFor(() => {
        const urlError = screen.getByText("Company Url is required");
        expect(urlError).toBeInTheDocument();
      });
    });

    it("display validation error for invalid url format", async () => {
      render(
        <ToastProvider>
          <LogoRequestForm closeModal={() => {}} />
        </ToastProvider>
      );
      const urlInput = screen.getByLabelText("Company Url");
      await act(async () => {
        fireEvent.change(urlInput, { target: { value: "http:/example.com" } });
        fireEvent.focus(urlInput);
        fireEvent.blur(urlInput);
      });
      await waitFor(() => {
        const urlError = screen.getByText("This is not a valid url");
        expect(urlError).toBeInTheDocument();
      });
    });

    it("display validation error for empty company description", async () => {
      render(
        <ToastProvider>
          <LogoRequestForm closeModal={() => {}} />
        </ToastProvider>
      );
      const companyDescriptionInput = screen.getByPlaceholderText(
        "Type company description here ..."
      );
      await act(async () => {
        fireEvent.focus(companyDescriptionInput);
      });
      await waitFor(() => {
        const companyDescriptionMisssing = screen.getByText(
          "Company Description is required"
        );
        expect(companyDescriptionMisssing).toBeInTheDocument();
      });
    });

    it("display validation error for short company description", async () => {
      render(
        <ToastProvider>
          <LogoRequestForm closeModal={() => {}} />
        </ToastProvider>
      );
      const companyDescriptionInput = screen.getByPlaceholderText(
        "Type company description here ..."
      );
      await act(async () => {
        fireEvent.change(companyDescriptionInput, {
          target: { value: "random company.." },
        });
      });
      await waitFor(() => {
        const companyDescriptionError = screen.getByText(
          "Description should be at least 20 characters"
        );
        expect(companyDescriptionError).toBeInTheDocument();
      });
    });
  });

  it("enables submit button only when form is valid", async () => {
    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );
    const sendRequestButton = screen.getByRole("button", {
      name: BUTTON_TEXT.sendRequest,
    });
    expect(sendRequestButton).toBeDisabled();
    await fillFormWithValidData();
    await waitFor(() => {
      expect(sendRequestButton).not.toBeDisabled();
    });
    const urlInput = screen.getByLabelText("Company Url");
    await act(async () => {
      fireEvent.change(urlInput, { target: { value: "http:/example.com" } });
    });
    await waitFor(() => {
      expect(sendRequestButton).toBeDisabled();
    });
  });

  it("shows loading state while submitting the form ", async () => {
    mockUseApi.mockReturnValue({
      makeRequest: mockMakeRequest,
      loading: true,
      isSuccess: false,
      errorMsg: null,
      data: null,
    });

    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );
    await waitFor(() => {
      const loadingButton = screen.getByRole("button", { name: "Sending" });
      expect(loadingButton).toBeInTheDocument();
      expect(loadingButton).toBeDisabled();
    });
  });

  it("shows success message when form is submitted successfully", async () => {
    mockUseApi.mockReturnValue({
      makeRequest: mockMakeRequest,
      loading: false,
      isSuccess: true,
      errorMsg: null,
      data: {
        message: "Logo request created successfully",
      },
    });
    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith(
        "Logo request created successfully"
      );
    });
  });

  it("shows error message when form submission fails", async () => {
    mockUseApi.mockReturnValue({
      makeRequest: mockMakeRequest,
      loading: false,
      isSuccess: false,
      errorMsg: "An error occurred",
      data: null,
    });

    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("An error occurred");
    });
  });

  it("calls closeModal after successful submission and timeout", async () => {
    vi.useFakeTimers();
    const mockCloseModal = vi.fn(() => {});

    mockUseApi.mockReturnValue({
      makeRequest: mockMakeRequest,
      loading: false,
      isSuccess: true,
      errorMsg: null,
      data: {
        message: "Logo request created successfully",
      },
    });
    render(
      <ToastProvider>
        <LogoRequestForm closeModal={mockCloseModal} />
      </ToastProvider>
    );
    expect(mockCloseModal).toHaveBeenCalledTimes(0);

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(mockCloseModal).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("clears form after successful submission", async () => {
    vi.useFakeTimers();

    mockUseApi.mockReturnValue({
      makeRequest: mockMakeRequest,
      loading: false,
      isSuccess: true,
      errorMsg: null,
      data: {
        message: "Logo request created successfully",
      },
    });

    render(
      <ToastProvider>
        <LogoRequestForm closeModal={() => {}} />
      </ToastProvider>
    );

    const companyUrlInput = screen.getByLabelText("Company Url");
    const companyDescriptionInput = screen.getByPlaceholderText(
      "Type company description here ..."
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(companyUrlInput.value).toBe("");
    expect(companyDescriptionInput.value).toBe("");

    vi.useRealTimers();
  });
});
