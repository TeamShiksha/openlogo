import { render, screen, waitFor } from "@testing-library/react";
import { expect, describe, it, vi, afterEach, beforeEach } from "vitest";
import Analytics from "../../../src/components/analytics/Analytics";

const mockData = [
  { title: "Users", value: 10 },
  { title: "Keys", value: 20 },
  { title: "Requests", value: 40 },
  { title: "Hits", value: 40 },
];

describe("Analytics component", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", () =>
      Promise.resolve({
        json: () => ({
          statusCode: 200,
          data: mockData,
        }),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correct number of AnalyticsCard components ", async () => {
    render(<Analytics />);

    const analytics = await screen.getByTestId("analytics");

    expect(analytics).toBeInTheDocument();

    await waitFor(() => {
      expect(analytics.children.length).toBe(mockData.length);
    });
  });
});
