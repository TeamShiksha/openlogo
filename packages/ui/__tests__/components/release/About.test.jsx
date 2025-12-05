import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../../../src/components/release/About";
import { RELEASE_PAGE } from "../../../src/utils/Constants";

describe("About component", () => {
  it("renders heading, description and features", () => {
    render(<About />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveTextContent(RELEASE_PAGE.introduction.heading);

    const description = screen.getByText(RELEASE_PAGE.introduction.description);
    expect(description).toBeInTheDocument();

    // Check features list renders
    RELEASE_PAGE.introduction.features.forEach((feature) => {
      // feature heading is rendered followed by a colon and space
      const headingRegex = new RegExp(feature.heading);
      expect(screen.getByText(headingRegex)).toBeInTheDocument();
      expect(screen.getByText(feature.desc)).toBeInTheDocument();
    });
  });
});
