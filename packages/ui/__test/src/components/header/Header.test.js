import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { headerItems } from "../../utils/constants";

describe("Header Component Tests", () => {
  test("render the header with heading and the header items", () => {
    render(<Header />);
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
