import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { headerItems } from "../../utils/constants";
import MobileHeaderMenu from "./MobileHeaderMenu";

describe("Header Component Tests", () => {
  test("render the header with heading and the header items", () => {
    render(<MobileHeaderMenu />);
    expect(screen.getByText("Header")).toBeDefined();

    const openLogoText = screen.getByRole("heading", {
      level: 4,
      name: /openlogo/i,
    });
    expect(openLogoText).toBeInTheDocument();

    headerItems.forEach(({ title }, index) => {
      const itemTitle = screen.getByRole("link", {
        name: title,
      });
      expect(itemTitle).toBeInTheDocument();
    });
  });
});
