import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import OperatorDashboard from "../../../src/components/operator/OperatorDashboard";
import { instance as apiInstance } from "../../../src/api/api_instance";
import { ToastProvider } from "../../../src/contexts/ToastContext";
import {
  BUTTON_TEXT,
  MODAL_MESSAGES,
  OPERATOR_MESSAGES,
  OPERATOR_ARCHIVED_MESSAGES,
} from "../../../src/utils/Constants";

vi.mock("../../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

describe("Operator Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders and fetches messages by default", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      const email = screen.getByText("test@example.com");
      expect(email).toBeInTheDocument();
      const message = screen.getByText("Test message");
      expect(message).toBeInTheDocument();
    });
  });

  it("displays PENDING label in OperatorCard when Active tab is selected", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      const closedAt = screen.queryByText("Closed at");
      expect(closedAt).not.toBeInTheDocument();
      const pending = screen.getByText("PENDING");
      expect(pending).toBeInTheDocument();
    });
  });

  it("switches to archived tab and fetches data", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    apiInstance.get.mockResolvedValueOnce(OPERATOR_ARCHIVED_MESSAGES);

    render(
      <ToastProvider>
        <OperatorDashboard />
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
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    apiInstance.get.mockResolvedValueOnce(requests);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "requests" },
    });

    await waitFor(() => {
      const companyUrl = screen.getByText(requests.data.results[0].companyUrl);
      expect(companyUrl).toBeInTheDocument();
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
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      const noMessages = screen.getByText("No messages found for this filter.");
      expect(noMessages).toBeInTheDocument();
    });
  });

  it("shows 'No requests found for this filter' when requests are empty", async () => {
    const emptyRequests = {
      data: {
        results: [],
        totalPages: 0,
      },
    };
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    apiInstance.get.mockResolvedValueOnce(emptyRequests);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "requests" },
    });

    await waitFor(() => {
      const noRequests = screen.getByText("No requests found for this filter.");
      expect(noRequests).toBeInTheDocument();
    });
  });

  it("opens respond and reject modals and sends update requests with messages", async () => {
    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    apiInstance.put.mockResolvedValue({ data: {} });

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      const respond = screen.getByText("Respond");
      expect(respond).toBeInTheDocument();
    });

    const validTestText =
      "This is a valid test response that doest exceeds, limit of characters.?";

    fireEvent.click(screen.getByText(BUTTON_TEXT.respond));

    await waitFor(() => {
      const respondModalTitle = screen.getByText("Respond to Message");
      const respondModalButton = screen.getByText(BUTTON_TEXT.sendResponse);
      expect(respondModalTitle).toBeInTheDocument();
      expect(respondModalButton).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(MODAL_MESSAGES.RESPOND);
    fireEvent.change(textarea, {
      target: {
        value: validTestText,
      },
    });
    const sendBtn = screen.getByRole("button", {
      name: BUTTON_TEXT.sendResponse,
    });
    fireEvent.click(sendBtn);
    await waitFor(() => {
      expect(sendBtn).toBeDisabled();
      expect(within(sendBtn).getByTestId("spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(apiInstance.put).toHaveBeenNthCalledWith(1, "/messages/1", {
        reply: validTestText,
        status: "RESOLVED",
      });
    });

    await waitFor(() => {
      const rejectButton = screen.getByText(BUTTON_TEXT.reject);
      expect(rejectButton).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      const rejectModalTitle = screen.getByText("Reject Message");
      const rejectMoadlButton = screen.getByText(BUTTON_TEXT.confirmRejection);
      expect(rejectModalTitle).toBeInTheDocument();
      expect(rejectMoadlButton).toBeInTheDocument();
    });

    const textarea2 = screen.getByPlaceholderText(MODAL_MESSAGES.REJECT);
    fireEvent.change(textarea2, {
      target: {
        value: validTestText,
      },
    });
    const confirmBtn = screen.getByRole("button", {
      name: BUTTON_TEXT.confirmRejection,
    });
    fireEvent.click(confirmBtn);
    await waitFor(() => {
      expect(confirmBtn).toBeDisabled();
      expect(within(confirmBtn).getByTestId("spinner")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(apiInstance.put).toHaveBeenNthCalledWith(2, "/messages/1", {
        reply: validTestText,
        status: "REJECTED",
      });
    });
  });
});
