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

import { useApi } from "../../../src/hooks/useApi";
import axios from "axios";

vi.mock("axios", () => ({
  default: {
    put: vi.fn(),
  },
}));

vi.mock("../../../src/hooks/useApi", () => ({
  useApi: vi.fn(),
}));

vi.mock("../../../src/api/api_instance", () => ({
  instance: {
    get: vi.fn(),
    put: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../../../src/components/catalog/ImageUploadModal", () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onUpload, isLoading }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="image-upload-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
        <input
          data-testid="file-input"
          type="file"
          onChange={(e) => {
            const file = new File(["test content"], "test.jpg", {
              type: "image/jpeg",
            });
            Object.defineProperty(e.target, "files", {
              value: [file],
              writable: false,
            });
          }}
        />
        <button
          data-testid="upload-button"
          onClick={() => {
            const file = new File(["test content"], "test.jpg", {
              type: "image/jpeg",
            });
            onUpload({ file, companyUri: "test-uri" });
          }}
        >
          Upload
        </button>
        {isLoading && <span>Loading...</span>}
      </div>
    );
  },
}));

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const delayedResolve = (data, ms = 100) =>
  new Promise((res) => setTimeout(() => res(data), ms));

describe("Operator Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    useApi.mockReturnValue({
      loading: false,
      makeRequest: vi.fn(),
      fetchRequest: vi.fn(),
      errorMsg: null,
    });
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

  it("should render the 'Add image' button", async () => {
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add image" })
      ).toBeInTheDocument();
    });
  });

  it("should not show the ImageUploadModal initially", async () => {
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(
        screen.queryByTestId("image-upload-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("should open the ImageUploadModal when 'Add image' button is clicked", async () => {
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add image" })
      ).toBeInTheDocument();
    });
    const addButton = screen.getByRole("button", { name: "Add image" });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByTestId("image-upload-modal")).toBeInTheDocument();
    });
  });

  it("should close the ImageUploadModal when close button is clicked", async () => {
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add image" })
      ).toBeInTheDocument();
    });
    const addButton = screen.getByRole("button", { name: "Add image" });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("image-upload-modal")).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId("close-modal");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId("image-upload-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("should call onUpload with correct data when upload is triggered from modal", async () => {
    const uploadMakeRequest = vi.fn().mockResolvedValue({
      success: true,
      message: "Image uploaded successfully",
    });

    const getPresignedURLRequest = vi.fn().mockResolvedValue({
      success: true,
      data: {
        data: {
          presignedUrl: "https://example.com/presigned-url",
          key: "image.jpg",
        },
      },
    });

    // Clear all mocks
    vi.clearAllMocks();
    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    let callCount = 0;
    useApi.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          loading: false,
          makeRequest: uploadMakeRequest,
          errorMsg: null,
        };
      } else {
        return {
          loading: false,
          fetchRequest: getPresignedURLRequest,
          errorMsg: null,
        };
      }
    });

    axios.put.mockResolvedValue({
      status: 200,
      statusText: "Ok",
    });

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Add image" })
      ).toBeInTheDocument();
    });

    const addButton = screen.getByRole("button", { name: "Add image" });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId("upload-button")).toBeInTheDocument();
    });

    const uploadButton = screen.getByTestId("upload-button");
    fireEvent.click(uploadButton);
    await sleep(100);

    console.log(
      "getPresignedURLRequest calls:",
      getPresignedURLRequest.mock.calls
    );
    console.log("uploadMakeRequest calls:", uploadMakeRequest.mock.calls);

    await waitFor(
      () => {
        expect(getPresignedURLRequest).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });
  it("should show pagination when there are multiple pages", async () => {
    const multiPageMessages = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i}`,
          message: `Message ${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-01T00:00:00Z",
        })),
        totalPages: 3,
      },
    };
    apiInstance.get.mockResolvedValueOnce(multiPageMessages);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
    });
  });

  it("should go to next page when next button is clicked", async () => {
    const page1 = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i}`,
          message: `Message ${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-01T00:00:00Z",
        })),
        totalPages: 3,
      },
    };

    const page2 = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i + 6}`,
          message: `Message ${i + 6}`,
          name: `User ${i + 6}`,
          email: `user${i + 6}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-02T00:00:00Z",
        })),
        totalPages: 3,
      },
    };

    apiInstance.get.mockResolvedValueOnce(page1);
    apiInstance.get.mockResolvedValueOnce(page2);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
    });

    const nextBtn = screen.getByRole("button", { name: "»" });
    fireEvent.click(nextBtn);

    await waitFor(() => {
      expect(apiInstance.get).toHaveBeenCalledWith("/messages", {
        params: expect.objectContaining({ page: 2 }),
      });
    });
  });
  it("should go to previous page when prev button is clicked", async () => {
    const page1 = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i}`,
          message: `Message ${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-01T00:00:00Z",
        })),
        totalPages: 3,
      },
    };
    const page2 = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i + 6}`,
          message: `Message ${i + 6}`,
          name: `User ${i + 6}`,
          email: `user${i + 6}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-02T00:00:00Z",
        })),
        totalPages: 3,
      },
    };
    apiInstance.get.mockResolvedValueOnce(page1);
    apiInstance.get.mockResolvedValueOnce(page2);
    apiInstance.get.mockResolvedValueOnce(page1);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
    });
    const nextBtn = screen.getByRole("button", { name: "»" });
    fireEvent.click(nextBtn);
    await waitFor(() => {
      expect(screen.getByText(/Page 2 of 3/i)).toBeInTheDocument();
    });
    const prevBtn = screen.getByRole("button", { name: "«" });
    fireEvent.click(prevBtn);
    await waitFor(() => {
      expect(apiInstance.get).toHaveBeenCalledWith("/messages", {
        params: expect.objectContaining({ page: 1 }),
      });
    });
  });
  it("should show pagination with multiple pages", async () => {
    const multiPageMessages = {
      data: {
        results: new Array(6).fill(null).map((_, i) => ({
          _id: `${i}`,
          message: `Message ${i}`,
          name: `User ${i}`,
          email: `user${i}@example.com`,
          status: "PENDING",
          openedAt: "2025-06-01T00:00:00Z",
        })),
        totalPages: 3,
      },
    };
    apiInstance.get.mockResolvedValueOnce(multiPageMessages);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(screen.getByText(/Page 1 of 3/i)).toBeInTheDocument();
    });
  });
  it("should trigger web search when search input is changed", async () => {
    const searchMakeRequest = vi.fn().mockResolvedValue({
      source: "web-search",
      data: [
        {
          companyName: "Example Inc",
          url: "https://example.com/logo.png",
          companyUri: "https://example.com",
        },
      ],
    });
    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    useApi.mockImplementation(({ url }) => {
      if (url?.includes("catalog/logos")) {
        return {
          loading: false,
          makeRequest: searchMakeRequest,
          fetchRequest: vi.fn(),
          errorMsg: null,
        };
      }
      return {
        loading: false,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
        errorMsg: null,
      };
    });
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "example" } });
    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();
    await waitFor(() => {
      expect(searchMakeRequest).toHaveBeenCalled();
    });
  });
  it("should disable respond button when response text is empty", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      const respond = screen.getByText("Respond");
      expect(respond).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(BUTTON_TEXT.respond));
    await waitFor(() => {
      const sendBtn = screen.getByRole("button", {
        name: BUTTON_TEXT.sendResponse,
      });
      expect(sendBtn).toBeDisabled();
    });
  });
  it("should enable respond button when valid response is entered", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      const respond = screen.getByText("Respond");
      expect(respond).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText(BUTTON_TEXT.respond));
    const textarea = await screen.findByPlaceholderText(MODAL_MESSAGES.RESPOND);
    fireEvent.change(textarea, {
      target: { value: "This is a valid response message that is long enough" },
    });
    await waitFor(() => {
      const sendBtn = screen.getByRole("button", {
        name: BUTTON_TEXT.sendResponse,
      });
      expect(sendBtn).not.toBeDisabled();
    });
  });
  it("should show character count in response modal", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      const respond = screen.getByText("Respond");
      fireEvent.click(respond);
    });
    const textarea = await screen.findByPlaceholderText(MODAL_MESSAGES.RESPOND);
    fireEvent.change(textarea, { target: { value: "Test text" } });
    await waitFor(() => {
      expect(screen.getByText(/\[9\//)).toBeInTheDocument();
    });
  });
  it("should disable reject button when rejection text is empty", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      const reject = screen.getByText("Reject");
      expect(reject).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Reject"));

    await waitFor(() => {
      const confirmBtn = screen.getByRole("button", {
        name: BUTTON_TEXT.confirmRejection,
      });
      expect(confirmBtn).toBeDisabled();
    });
  });
  it("should maintain active tab state when switching search types", async () => {
    const archivedMessages = {
      data: {
        results: [
          {
            _id: "2",
            message: "Archived message",
            name: "User 2",
            email: "user2@example.com",
            status: "RESOLVED",
            openedAt: "2025-06-01T00:00:00Z",
            closedAt: "2025-06-02T00:00:00Z",
          },
        ],
        totalPages: 1,
      },
    };

    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    apiInstance.get.mockResolvedValueOnce(archivedMessages);

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    fireEvent.click(screen.getByText("Archived"));

    await waitFor(() => {
      expect(screen.getByText("Archived message")).toBeInTheDocument();
    });

    expect(apiInstance.get).toHaveBeenCalledWith("/messages", {
      params: expect.objectContaining({ tab: "archived" }),
    });
  });
  it("should show loading spinner when submitting response", async () => {
    apiInstance.get.mockResolvedValueOnce(OPERATOR_MESSAGES);
    apiInstance.put.mockImplementation(() => delayedResolve({ data: {} }, 100));
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      const respond = screen.getByText("Respond");
      fireEvent.click(respond);
    });
    const textarea = await screen.findByPlaceholderText(MODAL_MESSAGES.RESPOND);
    fireEvent.change(textarea, { target: { value: "Response" } });

    const sendBtn = screen.getByRole("button", {
      name: BUTTON_TEXT.sendResponse,
    });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(sendBtn).toBeDisabled();
    });
  });
  it("should clear search results when search input is cleared", async () => {
    const searchMakeRequest = vi.fn();
    const mockWebData = {
      source: "web-search",
      data: [
        {
          companyName: "Example",
          url: "https://example.com/logo.png",
          companyUri: "https://example.com",
        },
      ],
    };

    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    useApi.mockImplementation(({ url }) => {
      if (url?.includes("catalog/logos")) {
        return {
          loading: false,
          makeRequest: searchMakeRequest,
          fetchRequest: vi.fn(),
          errorMsg: null,
          data: null,
        };
      }
      return {
        loading: false,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
        errorMsg: null,
        data: null,
      };
    });

    const { rerender } = render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "example" } });

    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();

    await waitFor(() => {
      expect(searchMakeRequest).toHaveBeenCalled();
    });
    useApi.mockImplementation(({ url }) => {
      if (url?.includes("catalog/logos")) {
        return {
          loading: false,
          makeRequest: searchMakeRequest,
          fetchRequest: vi.fn(),
          errorMsg: null,
          data: mockWebData,
        };
      }
      return {
        loading: false,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
        errorMsg: null,
        data: null,
      };
    });

    rerender(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await screen.findByText(/example/i);
    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(
        screen.queryByText((content) => content === "Example")
      ).not.toBeInTheDocument();
    });
  });
  it("should render multiple messages in the list", async () => {
    const multipleMessages = {
      data: {
        results: [
          {
            _id: "1",
            message: "First message",
            name: "User 1",
            email: "user1@example.com",
            status: "PENDING",
            openedAt: "2025-06-01T00:00:00Z",
          },
          {
            _id: "2",
            message: "Second message",
            name: "User 2",
            email: "user2@example.com",
            status: "PENDING",
            openedAt: "2025-06-02T00:00:00Z",
          },
          {
            _id: "3",
            message: "Third message",
            name: "User 3",
            email: "user3@example.com",
            status: "PENDING",
            openedAt: "2025-06-03T00:00:00Z",
          },
        ],
        totalPages: 1,
      },
    };
    apiInstance.get.mockResolvedValueOnce(multipleMessages);
    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("First message")).toBeInTheDocument();
      expect(screen.getByText("Second message")).toBeInTheDocument();
      expect(screen.getByText("Third message")).toBeInTheDocument();
    });
  });
  it("should render web search results when available", async () => {
    const webSearchResults = {
      source: "web-search",
      data: [
        {
          companyName: "Example Inc",
          url: "https://example.com/logo.png",
          companyUri: "https://example.com",
        },
      ],
    };

    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    useApi.mockImplementation(({ url }) => {
      if (url?.includes("catalog/logos")) {
        return {
          loading: false,
          makeRequest: vi.fn(),
          fetchRequest: vi.fn().mockResolvedValue(webSearchResults),
          errorMsg: null,
        };
      }
      return {
        loading: false,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
        errorMsg: null,
      };
    });

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "example" } });

    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();

    expect(searchInput).toHaveValue("example");
  });
  it("should not render web search results when input is cleared", async () => {
    const webSearchResults = {
      source: "web-search",
      data: [
        {
          companyName: "Example Inc",
          url: "https://example.com/logo.png",
          companyUri: "https://example.com",
        },
      ],
    };

    apiInstance.get.mockResolvedValue(OPERATOR_MESSAGES);
    useApi.mockImplementation(({ url }) => {
      if (url?.includes("catalog/logos")) {
        return {
          loading: false,
          makeRequest: vi.fn(),
          fetchRequest: vi.fn().mockResolvedValue(webSearchResults),
          errorMsg: null,
        };
      }
      return {
        loading: false,
        makeRequest: vi.fn(),
        fetchRequest: vi.fn(),
        errorMsg: null,
      };
    });

    render(
      <ToastProvider>
        <OperatorDashboard />
      </ToastProvider>
    );

    const searchInput = screen.getByRole("searchbox");
    fireEvent.change(searchInput, { target: { value: "example" } });

    vi.useFakeTimers();
    vi.advanceTimersByTime(500);
    vi.useRealTimers();

    expect(searchInput).toHaveValue("example");

    fireEvent.change(searchInput, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.queryByText(/Suggested Images/)).not.toBeInTheDocument();
      expect(screen.queryByText(/webresultco/i)).not.toBeInTheDocument();
    });
  });
});
