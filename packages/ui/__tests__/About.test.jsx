import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../src/components/about/About";
import { INTEGRATIONS, ABOUT_TEXT } from "../src/utils/Constants";

describe("About Component", () => {
  it("Should have title and description", () => {
    render(<About />);

    const titleElement = screen.getByText("What is Openlogo");
    expect(titleElement).toBeVisible();

    const descriptionElement = screen.getByText(ABOUT_TEXT.DESCRIPTION);
    expect(descriptionElement).toBeVisible();
  });

  it("Should render integrated images", () => {
    render(<About />);

    INTEGRATIONS.forEach((integration) => {
      const imageElement = screen.getByAltText(integration.alt);
      expect(imageElement).toBeDefined();
      expect(imageElement).toHaveAttribute("src", integration.src);
    });
  });
});
