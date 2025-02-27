import { render, screen } from "@testing-library/react";
import Features from "../src/components/features/Features";
import { expect, describe, it } from "vitest";
import { features } from "../src/utils/Constants.js";

describe("Features component", () => {
  it('should render the title "Features"', () => {
    render(<Features />);
    const titleElement = screen.getByText("Features");
    expect(titleElement).toBeVisible();
  });

  it("should render the features list with correct items", () => {
    render(<Features />);

    features.items.forEach((featureItem) => {
      const titleElement = screen.getByText(featureItem.title);
      const contentElement = screen.getByText(featureItem.content);
      expect(titleElement).toBeVisible();
      expect(contentElement).toBeVisible();
    });
  });

  it('should render images with alt text "logo"', () => {
    render(<Features />);
    const images = screen.getAllByAltText("logo");
    expect(images.length).toBe(features.items.length);
  });
});
