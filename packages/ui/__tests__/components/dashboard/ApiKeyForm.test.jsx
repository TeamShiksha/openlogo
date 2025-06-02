import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import ApiKeyForm from "../../../src/components/dashboard/apikeyform/ApiKeyForm";
import { ToastProvider } from "../../../src/contexts/ToastContext";

const mockedMakeRequest = vi.fn();
const mockApiData = {
  data: {
    api_key: "TEST_API_KEY_123456789",
  },
};

vi.mock("../../../src/hooks/useApi", () => ({
  useApi: () => ({
    makeRequest: mockedMakeRequest,
    data: mockApiData,
    loading: false,
    errorMsg: null,
  }),
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
};

vi.mock("../../../src/hooks/useToast", () => ({
  useToast: () => mockToast,
}));

vi.stubGlobal("navigator", {
  ...navigator,
  clipboard: {
    writeText: vi.fn(),
  },
});

const defaultProps = {
  isGuest: false,
  onKeyGenerated: vi.fn(),
};

const renderApiKeyForm = (props = {}) => {
  return render(
    <ToastProvider>
      <ApiKeyForm {...defaultProps} {...props} />
    </ToastProvider>
  );
};

describe("ApiKeyForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form elements correctly", () => {
    renderApiKeyForm();

    expect(
      screen.getByText("Generate a new API key to use in your projects.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Add the description")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate Key" })
    ).toBeInTheDocument();
  });

  it("allows user to input description", () => {
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    fireEvent.change(descriptionInput, { target: { value: "Test API Key" } });

    expect(descriptionInput.value).toBe("Test API Key");
  });

  it("disables generate button when user is guest", () => {
    renderApiKeyForm({ isGuest: true });

    const generateButton = screen.getByRole("button", { name: "Generate Key" });
    expect(generateButton).toBeDisabled();
  });

  it("enables generate button when user is not guest and has description", () => {
    renderApiKeyForm({ isGuest: false });

    const descriptionInput = screen.getByLabelText("Add the description");
    fireEvent.change(descriptionInput, {
      target: { value: "Test Description" },
    });

    const generateButton = screen.getByRole("button", { name: "Generate Key" });
    expect(generateButton).not.toBeDisabled();
  });

  it("disables generate button when description is empty", () => {
    renderApiKeyForm({ isGuest: false });

    const generateButton = screen.getByRole("button", { name: "Generate Key" });
    expect(generateButton).toBeDisabled();
  });

  it("submits form with description when generate key is clicked", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, {
      target: { value: "Production API Key" },
    });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
    });
  });

  it("shows success toast when API key is generated successfully", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "API key generated successfully"
      );
    });
  });

  it("clears description input after successful key generation", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(descriptionInput.value).toBe("");
    });
  });

  it("shows modal with API key after successful generation", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Your API Key")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Please copy your API key now. You won't be able to see it again!"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("TEST_API_KEY_123456789")).toBeInTheDocument();
    });
  });

  it("copies API key to clipboard when copy button is clicked", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      const copyButton = screen.getByAltText("Copy API key");
      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "TEST_API_KEY_123456789"
      );
      expect(mockToast.info).toHaveBeenCalledWith(
        "API key copied to clipboard"
      );
    });
  });

  it("calls onKeyGenerated when modal is closed", async () => {
    mockedMakeRequest.mockResolvedValue(true);
    const onKeyGeneratedMock = vi.fn();
    renderApiKeyForm({ onKeyGenerated: onKeyGeneratedMock });

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText("Your API Key")).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(onKeyGeneratedMock).toHaveBeenCalled();
    });
  });

  it("handles API key generation failure", async () => {
    mockedMakeRequest.mockResolvedValue(false);
    renderApiKeyForm();

    const descriptionInput = screen.getByLabelText("Add the description");
    const generateButton = screen.getByRole("button", { name: "Generate Key" });

    fireEvent.change(descriptionInput, { target: { value: "Test Key" } });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(mockedMakeRequest).toHaveBeenCalled();
      expect(screen.queryByText("Your API Key")).not.toBeInTheDocument();
    });
  });

  it("shows loading state when generating key", async () => {
    vi.mocked(vi.importActual("../../../src/hooks/useApi")).useApi = () => ({
      makeRequest: mockedMakeRequest,
      data: mockApiData,
      loading: true,
      errorMsg: null,
    });

    renderApiKeyForm();

    const generateButton = screen.getByRole("button", { name: /Generate Key/ });
    expect(generateButton).toBeInTheDocument();
  });
});
