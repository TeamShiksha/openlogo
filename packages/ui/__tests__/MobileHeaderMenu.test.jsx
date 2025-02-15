import {
  render,
  screen,
  fireEvent,
  describe,
  it,
  expect,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MobileHeaderMenu from "../src/components/header/MobileHeaderMenu.jsx";
import { vi } from "vitest";

const mockCloseMenu = vi.fn();
const HEADER_ITEMS = [
  { name: "home", title: "Home", url: "/" },
  { name: "docs", title: "Docs", url: "/docs" },
  { name: "features", title: "Features", url: "/features" },
  { name: "pricing", title: "Pricing", url: "/pricing" },
  { name: "about", title: "About", url: "/about" },
];

vi.mock("../../utils/Constants", () => ({ HEADER_ITEMS }));

describe("MobileHeaderMenu Component", () => {
  it("should not render when isOpen is false", () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={false} />
      </BrowserRouter>
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("should render correctly when isOpen is true", () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
      </BrowserRouter>
    );
    HEADER_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    });
  });

  it("should have correct href attributes for links", () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
      </BrowserRouter>
    );
    HEADER_ITEMS.forEach((item) => {
      expect(screen.getByText(item.title).closest("a")).toHaveAttribute(
        "href",
        item.url
      );
    });
  });

  it("should close the menu when window is resized above 780px", () => {
    render(
      <BrowserRouter>
        <MobileHeaderMenu closeMenu={mockCloseMenu} isOpen={true} />
      </BrowserRouter>
    );

    fireEvent.resize(window, { target: { innerWidth: 800 } });
    expect(mockCloseMenu).toHaveBeenCalledWith(false);
  });
});
