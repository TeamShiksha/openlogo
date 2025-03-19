import { render, screen } from "@testing-library/react";
import AnalyticsCard from "../../../src/components/analytics/AnalyticsCard";
import { INFO } from "../../../src/utils/Constants";
import "@testing-library/jest-dom";
import { expect, describe, it } from "vitest";

describe("PricingCard Component", () => {
  it("renders PricingCard with correct name, tagline, and keypoints", () => {
    const info = INFO[0]; // Use the first analytic card info

    render(<AnalyticsCard title={info.title} api={info.api} />);

    const apiText = info.api > 0 ? `+${info.api}%` : `-${info.api}%`;
    const titleElement = screen.getByText(info.title);
    const apiElement = screen.getByText(apiText);

    expect(titleElement).toBeInTheDocument();
    expect(apiElement).toBeInTheDocument();
  });
});
