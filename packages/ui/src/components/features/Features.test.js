import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Features from "./Features";
import { featureItems } from "../../utils/constants";

describe("Features Component", () => {
  // Test to check if the component renders successfully with the correct heading and description text
  test("renders the component with heading and description text", () => {
    render(<Features />);

    // Check for the main section heading
    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /features/i,
    });
    expect(mainHeading).toBeInTheDocument();

    // Check for the main description paragraph
    const descriptionText = screen.getByText(
      /LogoExecutive provides fast API access to a vast, regularly updated logo library/i
    );
    expect(descriptionText).toBeInTheDocument();
  });

  // Test to check if all feature items are present with correct titles
  test("renders all feature items with correct titles and content", () => {
    render(<Features />);

    // Check each feature item is rendered with its title and content
    featureItems.forEach(({ title, content }, index) => {
      const featureTitle = screen.getByRole("heading", {
        level: 3,
        name: title,
      });
      const featureContent = screen.getByText(content);

      expect(featureTitle).toBeInTheDocument();
      expect(featureContent).toBeInTheDocument();
    });
  });

  // Test to check if all feature items are rendered with their respective icons
  test("renders all feature items with their respective icons", () => {
    render(<Features />);

    // Check that each feature item has the corresponding icon
    featureItems.forEach(({ icon }) => {
      const featureIcon = screen.getByAltText("logo");
      expect(featureIcon).toHaveAttribute("src", icon);
    });
  });
});
