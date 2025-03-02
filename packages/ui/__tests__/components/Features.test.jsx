import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Features from "../../src/components/features/Features";
import { FEATURES } from "../../src/utils/Constants";

describe("Features component", () => {
  it("Features title should be visible", () => {
    render(<Features />);

    const titleElement = screen.getByText("Features");
    expect(titleElement).toBeVisible();
  });

  it("Feature list and images should be visible", () => {
    render(<Features />);

    FEATURES.items.forEach((FEATURE_ITEM) => {
      const titleElement = screen.getByText(FEATURE_ITEM.title);
      const contentElement = screen.getByText(FEATURE_ITEM.content);
      expect(titleElement).toBeVisible();
      expect(contentElement).toBeVisible();
    });
    const images = screen.getAllByAltText("logo");
    expect(images.length).toBe(FEATURES.items.length);
  });
});
