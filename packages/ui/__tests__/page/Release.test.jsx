import { expect, describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Release from "../../src/page/release/Release";

describe("Release page", () => {
  it("renders About and Changelog sections", () => {
    render(<Release />);

    const aboutHeading = screen.getByRole("heading", {
      level: 2,
      name: "About",
    });
    expect(aboutHeading).toBeInTheDocument();

    const changelogHeading = screen.getByRole("heading", {
      level: 2,
      name: "Changelog",
    });
    expect(changelogHeading).toBeInTheDocument();
  });
});
