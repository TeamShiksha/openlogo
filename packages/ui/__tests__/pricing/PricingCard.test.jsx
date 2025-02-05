import { render, screen } from "@testing-library/react";
import PricingCard from "../../src/components/pricing/PricingCard";
import { describe, expect, it } from "vitest";

describe("PricingCard Component", () => {
  const mockProps = {
    name: "Pro Plan",
    tagline: "Best for professionals",
    index: 0,
    keypoints: ["Feature 1", "Feature 2", "Feature 3"],
  };

  it("should have render name, tagline and keypoints as prop", () => {
    render(<PricingCard {...mockProps} />);

    expect(screen.getByText("Pro Plan")).toBeVisible();
    expect(screen.getByText("Best for professionals")).toBeVisible();
    mockProps.keypoints.forEach((point) => {
      expect(screen.getByText(point)).toBeVisible();
    });
  });

  it("should have 'Get Started' button for non index 1", () => {
    render(<PricingCard {...mockProps} />);
    const button = screen.getByRole("button", { name: "Get Started" });
    expect(button).toBeVisible();
    expect(button).not.toBeDisabled();
  });

  it("should have disabled button for 'Comming Soon' plans", () => {
    render(<PricingCard {...mockProps} index={1} />);
    const button = screen.getByRole("button", { name: "Coming Soon" });
    expect(button).toBeVisible();
    expect(button).toBeDisabled();
  });
});
