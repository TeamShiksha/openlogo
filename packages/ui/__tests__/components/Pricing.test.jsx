import { render, screen } from "@testing-library/react";
import Pricing from "../../src/components/pricing/Pricing";
import { PRICING } from "../../src/utils/Constants";
import "@testing-library/jest-dom";
import { vi, expect, describe, it } from "vitest";

// Mock PricingCard component
vi.mock("./PricingCard", () => ({
  default: ({ name, tagline }) => (
    <div data-testid="pricing-card">
      <h2>{name}</h2>
      <p>{tagline}</p>
    </div>
  ),
}));

describe("Pricing Component", () => {
  it("renders Pricing component with heading and summary", () => {
    render(<Pricing />);

    expect(screen.getByTestId("pricing")).toBeInTheDocument();
    expect(screen.getByText(PRICING.heading)).toBeInTheDocument();
    expect(screen.getByText(PRICING.summary)).toBeInTheDocument();
  });

  it("renders correct number of PricingCard components", () => {
    render(<Pricing />);
    const pricingCards = screen.getAllByTestId("pricing-card");
    expect(pricingCards.length).toBe(PRICING.plans.length);
  });
});
