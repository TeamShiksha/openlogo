import { vi, describe, it, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Documentation from "../src/page/documentation/Documentation";
import MobileHeaderMenu from "../src/components/header/MobileHeaderMenu";

const mockCloseMenu = vi.fn();

describe("MobileHeaderMenu Component", () => {
  it("Doesn't render when isOpen = false", () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
      </BrowserRouter>
    );

    const mobileMenu = screen.queryByTestId("mobile-menu");
    expect(mobileMenu).not.toBeInTheDocument();
  });

  it("Does render when isOpen = false and navigation works", async () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
        <Documentation />
      </BrowserRouter>
    );

    const mobileMenu = screen.getByTestId("mobile-menu");
    expect(mobileMenu).toBeInTheDocument();
    const docsNavigation = within(mobileMenu).getByText("Docs");
    expect(docsNavigation).toBeInTheDocument();
    await userEvent.click(docsNavigation);
    expect(window.location.pathname).toBe("/docs");
  });

  it("calls closeMenu when screen width exceeds 1024px", () => {
    window.innerWidth = 800;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
      </BrowserRouter>
    );

    window.innerWidth = 1100;
    window.dispatchEvent(new Event("resize"));
    expect(mockCloseMenu).toHaveBeenCalledWith(false);
  });
});
