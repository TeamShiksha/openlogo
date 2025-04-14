import { render, screen } from "@testing-library/react";
import { expect, describe, it } from "vitest";
import AnalyticsCard from "../../../src/components/analytics/AnalyticsCard";
import { ANALYTIC_CARDS } from "../../../src/utils/Constants";

describe("AnalyticsCard Component", () => {
  it("renders AnalyticsCard with correct name, tagline, and keypoints", () => {
    const first_card = ANALYTIC_CARDS[0]; // Use the first analytic card info

    render(<AnalyticsCard title={first_card.title} api={first_card.api} />);

    const apiText =
      first_card.api > 0 ? `+${first_card.api}%` : `-${first_card.api}%`;
    const titleElement = screen.getByText(first_card.title);
    const apiElement = screen.getByText(apiText);

    expect(titleElement).toBeInTheDocument();
    expect(apiElement).toBeInTheDocument();
  });
});
