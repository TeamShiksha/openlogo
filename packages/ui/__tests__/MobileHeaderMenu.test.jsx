import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import MobileHeaderMenu from "../src/components/header/MobileHeaderMenu";

vi.mock("../../utils/Constants", () => ({
  HEADER_ITEMS: [
    { name: "home", title: "Home", url: "/" },
    { name: "about", title: "About", url: "/about" },
  ],
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

describe("MobileHeaderMenu", () => {
  it("should render nothing when not open", () => {
    const closeMenu = vi.fn();
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={closeMenu} isOpen={false} />
      </BrowserRouter>
    );
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
  });

  it("should render menu items when open", () => {
    const closeMenu = vi.fn();
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={closeMenu} isOpen={true} />
      </BrowserRouter>
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("should close menu on window resize above 780px", () => {
    const closeMenu = vi.fn();
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={closeMenu} isOpen={true} />
      </BrowserRouter>
    );

    global.innerWidth = 800;
    global.dispatchEvent(new Event("resize"));

    expect(closeMenu).toHaveBeenCalledWith(false);
  });

  it("should navigate to correct route when clicking menu items", async () => {
    const closeMenu = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={closeMenu} isOpen={true} />
      </BrowserRouter>
    );

    await user.click(screen.getByText("Home"));
    expect(
      screen.getByRole("link", { name: /Home/i }).getAttribute("href")
    ).toBe("/");

    await user.click(screen.getByText("About"));
    expect(
      screen.getByRole("link", { name: /About/i }).getAttribute("href")
    ).toBe("/about");
  });
});
