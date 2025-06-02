import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Operator from "../../src/page/operator/Operator";
import { instance as apiInstance } from "../../src/api/api_instance";
import { ToastProvider } from "../../src/contexts/ToastContext";
import { BUTTON_TEXT } from "../../src/utils/Constants";

// Mock axios instance
vi.mock("../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const messages = {
  data: {
    results: [
      {
        _id: "1",
        status: "PENDING",
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
        openedAt: "2025-06-01T00:00:00Z",
      },
    ],
    totalPages: 1,
  },
};
const archivedMessages = {
  data: {
    results: [
      {
        _id: "2",
        status: "RESOLVED",
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
        openedAt: "2025-06-01T00:00:00Z",
        closedAt: "2025-06-02T00:00:00Z",
        comment: "Resolved this comment a long ago",
      },
    ],
    totalPages: 1,
  },
};
describe("Operator Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders and fetches messages by default", async () => {
    apiInstance.get.mockResolvedValueOnce(messages);
    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Opened at.*6\/1\/2025/i)).toBeInTheDocument();
      expect(screen.getByText("Test message")).toBeInTheDocument();
    });
  });

  it("displays PENDING label in OperatorCard when Active tab is selected", async () => {
    apiInstance.get.mockResolvedValueOnce(messages);

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.queryByText("Closed at")).not.toBeInTheDocument();
      expect(screen.getByText("PENDING")).toBeInTheDocument();
    });
  });

  it("switches to archived tab and fetches data", async () => {
    apiInstance.get.mockResolvedValueOnce(messages);
    apiInstance.get.mockResolvedValueOnce(archivedMessages);

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Archived"));

    await waitFor(() => {
      const resolvedOrRejected =
        screen.queryByText("RESOLVED") || screen.queryByText("REJECTED");
      expect(resolvedOrRejected).toBeInTheDocument();
    });
  });

  it("switches search type to requests and fetches requests", async () => {
    const requests = {
      data: {
        results: [
          {
            _id: "3",
            companyUrl: "https://youtube.com/",
            status: "PENDING",
            openedAt: "2025-06-01T00:00:00Z",
          },
        ],
        totalPages: 1,
      },
    };
    apiInstance.get.mockResolvedValueOnce(messages);
    apiInstance.get.mockResolvedValueOnce(requests);

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "requests" },
    });

    await waitFor(() => {
      expect(
        screen.getByText(`Company URL: ${requests.data.results[0].companyUrl}`)
      ).toBeInTheDocument();
    });
  });

  it("shows 'No messages found for this filter' when messages are empty", async () => {
    const emptyMessages = {
      data: {
        results: [],
        totalPages: 0,
      },
    };
    apiInstance.get.mockResolvedValueOnce(emptyMessages);

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText("No messages found for this filter.")
      ).toBeInTheDocument();
    });
  });

  it("shows 'No requests found for this filter' when requests are empty", async () => {
    const emptyRequests = {
      data: {
        results: [],
        totalPages: 0,
      },
    };
    apiInstance.get.mockResolvedValueOnce(messages);
    apiInstance.get.mockResolvedValueOnce(emptyRequests);

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "requests" },
    });

    await waitFor(() => {
      expect(
        screen.getByText("No requests found for this filter.")
      ).toBeInTheDocument();
    });
  });

  it("opens respond and reject modals and sends update requests with messages", async () => {
    apiInstance.get.mockResolvedValue(messages);
    apiInstance.put.mockResolvedValue({ data: {} });

    render(
      <ToastProvider>
        <Operator />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Respond")).toBeInTheDocument();
    });

    const validTestText =
      "This is a valid test response that doest exceeds limit of characters";

    fireEvent.click(screen.getByText(BUTTON_TEXT.respond));

    await waitFor(() => {
      const respondModalTitle = screen.getByText("Respond to Message");
      const respondModalButton = screen.getByText(BUTTON_TEXT.sendResponse);
      expect(respondModalTitle).toBeInTheDocument();
      expect(respondModalButton).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText("Type your response here...");
    fireEvent.change(textarea, {
      target: {
        value: validTestText,
      },
    });
    fireEvent.click(screen.getByText(BUTTON_TEXT.sendResponse));
    await waitFor(() => {
      expect(apiInstance.put).toHaveBeenNthCalledWith(1, "/messages/1", {
        reply: validTestText,
        status: "RESOLVED",
      });
    });

    await waitFor(() => {
      expect(screen.getByText(BUTTON_TEXT.reject)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      const rejectModalTitle = screen.getByText("Reject Message");
      const rejectMoadlButton = screen.getByText(BUTTON_TEXT.confirmRejection);
      expect(rejectModalTitle).toBeInTheDocument();
      expect(rejectMoadlButton).toBeInTheDocument();
    });

    const textarea2 = screen.getByPlaceholderText(
      "Please provide a reason for rejection..."
    );
    fireEvent.change(textarea2, {
      target: {
        value: validTestText,
      },
    });
    fireEvent.click(screen.getByText(BUTTON_TEXT.confirmRejection));
    await waitFor(() => {
      expect(apiInstance.put).toHaveBeenNthCalledWith(2, "/messages/1", {
        reply: validTestText,
        status: "REJECTED",
      });
    });
  });
});
