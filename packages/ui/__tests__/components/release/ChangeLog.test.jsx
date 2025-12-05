import { expect, describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChangeLog from "../../../src/components/release/ChangeLog";
import { RELEASE_PAGE } from "../../../src/utils/Constants";

describe("ChangeLog component", () => {
  it("renders header and selected version", () => {
    render(<ChangeLog />);

    // Check heading
    expect(
      screen.getByRole("heading", { name: /changelog/i })
    ).toBeInTheDocument();

    // Check selected version button
    const latestVersion = RELEASE_PAGE.latestVersion;

    const versionButton = screen.getByRole("button", {
      name: `Version ${latestVersion}`,
    });

    expect(versionButton).toBeInTheDocument();
  });

  it("opens dropdown and lets user select another version", () => {
    render(<ChangeLog />);

    const latestVersion = RELEASE_PAGE.latestVersion;

    // Toggle dropdown
    const toggleBtn = screen.getByRole("button", {
      name: `Version ${latestVersion}`,
    });

    fireEvent.click(toggleBtn);

    // Select a different version (2nd item from versions array)
    const anotherVersion = RELEASE_PAGE.versions[1];

    const optionBtn = screen.getByRole("button", {
      name: `Version ${anotherVersion}`,
    });

    fireEvent.click(optionBtn);

    // Expect UI to update
    expect(
      screen.getByRole("button", { name: `Version ${anotherVersion}` })
    ).toBeInTheDocument();
  });
});
