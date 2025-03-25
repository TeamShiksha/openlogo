import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import Analytics from "../../../src/components/analytics/Analytics";
import { ANALYTIC_CARDS } from "../../../src/utils/Constants";

describe("Analytics component", () => {
  it("renders correct number of AnalyticsCard components ", () => {
    render(<Analytics />);

    const analytics = screen.getByTestId("analytics");

    expect(analytics).toBeInTheDocument();
    ANALYTIC_CARDS.forEach((item) => {
      const titleElement = screen.getByText(item.title);
      expect(titleElement).toBeInTheDocument();
    });
  });
});
