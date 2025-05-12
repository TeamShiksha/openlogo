import { render, screen } from "@testing-library/react";
import PricingCard from "../../src/components/pricing/PricingCard";
import {
  BUTTON_TEXT,
  MOCK_USER_DATA,
  PRICING,
} from "../../src/utils/Constants";
import "@testing-library/jest-dom";
import { expect, describe, it, vi } from "vitest";

const openCloseAuthModal = vi.fn();

describe("PricingCard Component", () => {
  it("renders PricingCard with correct name, tagline, and keypoints", () => {
    const plan = PRICING.plans[0]; // Use the first plan (HOBBY)

    render(
      <PricingCard
        name={plan.name}
        tagline={plan.tagline}
        index={plan.index}
        keypoints={plan.keypoints}
        openAuthModal={openCloseAuthModal}
      />
    );

    const titleElement = screen.getByText(plan.name);
    const taglineElement = screen.getByText(plan.tagline);

    expect(titleElement).toBeInTheDocument();
    expect(taglineElement).toBeInTheDocument();

    plan.keypoints.forEach((keypoint) => {
      const keypointElement = screen.getByText(keypoint);
      expect(keypointElement).toBeInTheDocument();
    });
  });

  it("renders correct button text based on index when activePlan is undefined", () => {
    PRICING.plans.forEach((plan) => {
      render(<PricingCard {...plan} openAuthModal={openCloseAuthModal} />);
      const buttonText =
        plan.index === 1 ? BUTTON_TEXT.commingSoon : BUTTON_TEXT.getStarted;
      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
    });
  });

  it("renders correct button text based on index when activePlan is passed", () => {
    PRICING.plans.forEach((plan) => {
      render(
        <PricingCard
          {...plan}
          openAuthModal={openCloseAuthModal}
          activePlan={MOCK_USER_DATA.subscription.type}
        />
      );
      let buttonText = BUTTON_TEXT.getStarted;
      if (MOCK_USER_DATA.subscription.type === plan.name) {
        buttonText = BUTTON_TEXT.active;
      } else if (plan.index === 1) {
        buttonText = BUTTON_TEXT.commingSoon;
      }
      const buttonElement = screen.getByText(buttonText);
      expect(buttonElement).toBeInTheDocument();
    });
  });
});
