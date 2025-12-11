import { expect, describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChangeLog from "../../../src/components/release/ChangeLog";
import { RELEASE_PAGE } from "../../../src/utils/Constants";

describe("ChangeLog component", () => {
  it("renders header and selected version", () => {
    render(<ChangeLog />);

    expect(
      screen.getByRole("heading", { name: /changelog/i })
    ).toBeInTheDocument();

    const latestVersion = RELEASE_PAGE.latestVersion;

    const versionButton = screen.getByRole("button", {
      name: `Version ${latestVersion}`,
    });

    expect(versionButton).toBeInTheDocument();
  });

  it("opens dropdown and lets user select another version", () => {
    render(<ChangeLog />);

    const latestVersion = RELEASE_PAGE.latestVersion;

    const toggleBtn = screen.getByRole("button", {
      name: `Version ${latestVersion}`,
    });

    fireEvent.click(toggleBtn);

    const anotherVersion = RELEASE_PAGE.versions[1];

    const optionBtn = screen.getByRole("button", {
      name: `Version ${anotherVersion}`,
    });

    fireEvent.click(optionBtn);

    expect(
      screen.getByRole("button", { name: `Version ${anotherVersion}` })
    ).toBeInTheDocument();
  });
});
