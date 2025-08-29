import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, afterEach } from "vitest";
import Analytics from "../../../src/components/analytics/Analytics";
import { instance } from "../../../src/api/api_instance";
import { ToastContext } from "../../../src/contexts/Contexts";

const mockData = [
  { title: "Users", value: 10 },
  { title: "Keys", value: 20 },
  { title: "Requests", value: 40 },
  { title: "Hits", value: 40 },
];

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

vi.mock("../../../src/api/api_instance", () => ({
  instance: vi.fn(() => Promise.resolve({ data: { data: mockData } })),
}));

describe("Analytics component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders correct number of AnalyticsCard components ", async () => {
    instance.mockResolvedValueOnce({ data: { data: mockData } });

    render(
      <ToastContext.Provider value={mockToastContext}>
        <Analytics />
      </ToastContext.Provider>
    );

    const analytics = await screen.findByTestId("analytics");

    expect(analytics).toBeInTheDocument();

    await waitFor(() => {
      expect(analytics.children.length).toBe(mockData.length);
    });
  });
});
