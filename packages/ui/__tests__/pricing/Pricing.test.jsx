import { render, screen } from "@testing-library/react";
import Pricing from "../../src/components/pricing/Pricing";
import plans from "../../src/utils/Constants";
import { describe, it, expect } from "vitest";

describe("Pricing Component", () => {
  it("should have heading and tagline", () => {
    render(<Pricing />);

    expect(screen.getByText("Compare our plans and find yours")).toBeVisible();
    expect(
      screen.getByText(
        "Simple, transparent pricing that grows with you. Try any plan free for 30 days."
      )
    ).toBeVisible();
  });

  it("should have render all pricing card", () => {
    render(<Pricing />);

    const filteredPlans = plans.filter((plan) => plan.pricing !== null);
    filteredPlans.forEach((plan) => {
      expect(screen.getByText(plan.name)).toBeVisible();
      expect(screen.getByText(plan.tagline)).toBeVisible();
    });
  });
});
