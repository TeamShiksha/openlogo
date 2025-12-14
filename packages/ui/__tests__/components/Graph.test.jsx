import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Graph from "../../src/components/graph/Graph";

vi.mock("react-chartjs-2", () => ({
  Line: vi.fn(() => (
    <canvas role="img" aria-label="chart" data-testid="chart-canvas" />
  )),
}));

vi.mock("../../src/hooks/useApi", () => {
  const mockWeekApiResponse = {
    data: {
      data: [
        { date: "2025-11-01T00:00:00Z", count: 2 },
        { date: "2025-11-02T00:00:00Z", count: 3 },
        { date: "2025-11-03T00:00:00Z", count: 1 },
        { date: "2025-11-04T00:00:00Z", count: 4 },
        { date: "2025-11-05T00:00:00Z", count: 5 },
        { date: "2025-11-06T00:00:00Z", count: 2 },
        { date: "2025-11-07T00:00:00Z", count: 2 },
      ],
    },
  };
  const mockMonthApiResponse = {
    data: {
      data: Array.from({ length: 30 }, (_, dayIndex) => ({
        date: new Date(2025, 10, dayIndex + 1).toISOString(),
        count: Math.floor(Math.random() * 8),
      })),
    },
  };

  return {
    useApi: (opts) => {
      if (opts?.url?.includes("period=week")) {
        return {
          fetchRequest: vi.fn(),
          loading: false,
          errorMsg: null,
          isSuccess: true,
          data: mockWeekApiResponse,
        };
      }
      if (opts?.url?.includes("period=month")) {
        return {
          fetchRequest: vi.fn(),
          loading: false,
          errorMsg: null,
          isSuccess: true,
          data: mockMonthApiResponse,
        };
      }
      return {
        fetchRequest: vi.fn(),
        loading: false,
        errorMsg: null,
        isSuccess: false,
        data: null,
      };
    },
  };
});

describe("Graph component", () => {
  it("renders the chart canvas", () => {
    render(<Graph />);

    const canvas = screen.getByTestId("chart-canvas");
    expect(canvas).toBeInTheDocument();
  });

  it("renders week and month buttons", () => {
    render(<Graph />);

    const weekButton = screen.getByRole("button", { name: /week/i });
    const monthButton = screen.getByRole("button", { name: /month/i });

    expect(weekButton).toBeInTheDocument();
    expect(monthButton).toBeInTheDocument();
  });

  it("toggles between week and month views", () => {
    render(<Graph />);

    const weekButton = screen.getByRole("button", { name: /week/i });
    const monthButton = screen.getByRole("button", { name: /month/i });

    expect(weekButton).toHaveAttribute("aria-pressed", "true");
    expect(monthButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(monthButton);
    expect(monthButton).toHaveAttribute("aria-pressed", "true");
    expect(weekButton).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(weekButton);
    expect(weekButton).toHaveAttribute("aria-pressed", "true");
    expect(monthButton).toHaveAttribute("aria-pressed", "false");
  });
});
