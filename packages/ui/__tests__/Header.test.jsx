import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../src/components/header/Header";
import { HEADER_ITEMS } from "../src/utils/Constants";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

describe("Header Component", () => {
  it("renders all header navigation links with correct URLs", () => {
    render(<Header />, { wrapper: MemoryRouter });

    HEADER_ITEMS.forEach((item) => {
      const navLink = screen.getByText(item.title);
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute("href", item.url);
    });
  });

  it("header links should be clickable and navigate correctly", async () => {
    render(<Header />, { wrapper: MemoryRouter });

    for (const item of HEADER_ITEMS) {
      const navLink = screen.getByText(item.title);
      expect(navLink).toBeInTheDocument();

      await userEvent.click(navLink);

      expect(window.location.pathname).toBe(item.url);
    }
  });
});
