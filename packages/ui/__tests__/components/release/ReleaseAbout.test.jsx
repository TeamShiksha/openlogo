import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "../../../src/components/release/ReleaseAbout";
import { RELEASE_PAGE } from "../../../src/utils/Constants";

describe("About component", () => {
  it("renders heading, description and features", () => {
    render(<About />);

    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeVisible();

    const description = screen.getByText(RELEASE_PAGE.introduction.description);
    expect(description).toBeVisible();

    RELEASE_PAGE.introduction.features.forEach(({ heading, desc }) => {
      const featureHeading = screen.getByText(heading, { exact: false });
      const featureDesc = screen.getByText(desc, { exact: false });
      expect(featureHeading).toBeVisible();
      expect(featureDesc).toBeVisible();
    });
  });
});
