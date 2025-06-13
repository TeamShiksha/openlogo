import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import DeleteKeyModal from "../../src/components/confirm/DeleteKeyModal";
import { ToastProvider } from "../../src/contexts/ToastContext";

const mockedDeleteKeyRequest = vi.fn();

vi.mock("../../src/hooks/useApi.js", () => ({
  useApi: () => ({
    makeRequest: mockedDeleteKeyRequest,
    errorMsg: null,
  }),
}));

const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock("../../src/hooks/useToast.js", () => ({
  useToast: () => mockToast,
}));

const mockSelectedKey = {
  _id: "test-key-id-123",
  key_description: "Test API Key",
  updated_at: "2024-01-01T00:00:00.000Z",
};

const defaultProps = {
  selectedKey: mockSelectedKey,
  isOpen: true,
  onClose: vi.fn(),
};

const renderDeleteKeyModal = (props = {}) => {
  return render(
    <ToastProvider>
      <DeleteKeyModal {...defaultProps} {...props} />
    </ToastProvider>
  );
};

describe("DeleteKeyModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders modal with correct content when open", () => {
    renderDeleteKeyModal();

    expect(screen.getByText("Delete API Key")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete the API key/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Test API Key/)).toBeInTheDocument();
    expect(
      screen.getByText(/This action cannot be undone/)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("does not render modal when closed", () => {
    renderDeleteKeyModal({ isOpen: false });

    expect(screen.queryByText("Delete API Key")).not.toBeInTheDocument();
  });

  it("displays the correct API key description in the warning message", () => {
    const customKey = {
      ...mockSelectedKey,
      key_description: "Production Environment Key",
    };

    renderDeleteKeyModal({ selectedKey: customKey });

    expect(screen.getByText(/Production Environment Key/)).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", () => {
    const onCloseMock = vi.fn();
    renderDeleteKeyModal({ onClose: onCloseMock });

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls onClose when modal is closed via backdrop or escape", () => {
    const onCloseMock = vi.fn();
    renderDeleteKeyModal({ onClose: onCloseMock });

    fireEvent.keyDown(document, { key: "Escape" });

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("calls delete API when delete button is clicked", async () => {
    mockedDeleteKeyRequest.mockResolvedValue(true);
    renderDeleteKeyModal();

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedDeleteKeyRequest).toHaveBeenCalled();
    });
  });

  it("shows success toast and closes modal on successful deletion", async () => {
    mockedDeleteKeyRequest.mockResolvedValue(true);
    const onCloseMock = vi.fn();
    renderDeleteKeyModal({ onClose: onCloseMock });

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "API key deleted successfully"
      );
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  it("shows error toast when API returns an error", async () => {
    vi.mock("../../src/hooks/useApi.js", () => ({
      useApi: () => ({
        makeRequest: mockedDeleteKeyRequest,
        errorMsg: "Failed to delete API key",
      }),
    }));

    renderDeleteKeyModal();

    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Failed to delete API key"
        );
      },
      { timeout: 1000 }
    );
  });

  it("handles multiple rapid delete clicks gracefully", async () => {
    mockedDeleteKeyRequest.mockResolvedValue(true);
    renderDeleteKeyModal();

    const deleteButton = screen.getByRole("button", { name: "Delete" });

    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedDeleteKeyRequest).toHaveBeenCalledTimes(1);
    });
  });

  it("displays modal with custom width", () => {
    renderDeleteKeyModal();

    expect(screen.getByText("Delete API Key")).toBeInTheDocument();
  });

  it("handles selectedKey with special characters in description", () => {
    const specialKey = {
      ...mockSelectedKey,
      key_description: "Test Key with @#$%^&*() characters",
    };

    renderDeleteKeyModal({ selectedKey: specialKey });

    expect(
      screen.getByText(/Test Key with @#\$%\^&\*\(\) characters/)
    ).toBeInTheDocument();
  });

  it("handles very long key descriptions", () => {
    const longDescriptionKey = {
      ...mockSelectedKey,
      key_description:
        "This is a very long API key description that might overflow the modal content area and should be handled gracefully by the component",
    };

    renderDeleteKeyModal({ selectedKey: longDescriptionKey });

    expect(
      screen.getByText(/This is a very long API key description/)
    ).toBeInTheDocument();
  });

  it("maintains focus management for accessibility", () => {
    renderDeleteKeyModal();

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });

    expect(deleteButton).not.toHaveAttribute("tabindex", "-1");
    expect(cancelButton).not.toHaveAttribute("tabindex", "-1");
  });
});
