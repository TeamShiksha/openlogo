import { render, screen } from "@testing-library/react";
import Pricing from "../../src/components/pricing/Pricing";
import { PRICING } from "../../src/utils/Constants";
import "@testing-library/jest-dom";
import { expect, describe, it } from "vitest";

describe("Pricing Component", () => {
  it("renders Pricing component with heading and summary", () => {
    render(<Pricing />);

    const pricing = screen.getByTestId("pricing");
    const pricing_heading = screen.getByText(PRICING.heading);
    const pricing_summary = screen.getByText(PRICING.summary);

    expect(pricing).toBeInTheDocument();
    expect(pricing_heading).toBeInTheDocument();
    expect(pricing_summary).toBeInTheDocument();
  });

  it("renders correct number of PricingCard components", () => {
    render(<Pricing />);

    PRICING.plans.forEach((plan) => {
      const titleElement = screen.getByText(plan.name);
      const taglineElement = screen.getByText(plan.tagline);

      expect(taglineElement).toBeInTheDocument();
      expect(titleElement).toBeInTheDocument();
      plan.keypoints.forEach((keypoint) => {
        const plan_keypoint = screen.getByText(keypoint);
        expect(plan_keypoint).toBeInTheDocument();
      });
    });
  });
});
