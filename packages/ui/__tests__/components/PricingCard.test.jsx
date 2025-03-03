import { render, screen } from "@testing-library/react";
import PricingCard from "../../src/components/pricing/PricingCard";
import { BUTTON_TEXT } from "../../src/utils/Constants";
import "@testing-library/jest-dom";
import { expect, describe, it } from "vitest";

describe("PricingCard Component", () => {
  const mockProps = {
    name: "Basic Plan",
    tagline: "Best for individuals",
    index: 0,
    keypoints: ["Feature 1", "Feature 2"],
  };

  it("renders PricingCard with correct props", () => {
    render(<PricingCard {...mockProps} />);

    expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    expect(screen.getByText(mockProps.tagline)).toBeInTheDocument();
    mockProps.keypoints.forEach((point) =>
      expect(screen.getByText(point)).toBeInTheDocument()
    );
  });

  it("displays correct button text and state based on index", () => {
    render(<PricingCard {...mockProps} />);
    expect(screen.getByRole("button")).toHaveTextContent(
      BUTTON_TEXT.getStarted
    );
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("disables button when index is 1", () => {
    render(<PricingCard {...mockProps} index={1} />);
    expect(screen.getByRole("button")).toHaveTextContent(
      BUTTON_TEXT.commingSoon
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
