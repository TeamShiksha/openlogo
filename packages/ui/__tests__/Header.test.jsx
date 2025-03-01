import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Header from "../src/components/header/Header";
import Home from "../src/page/home/Home";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  BUTTON_TEXT,
  BRANDING,
} from "../src/utils/Constants";

vi.mock("../src/components/header/MobileHeaderMenu", () => ({
  default: ({ isOpen, closeMenu }) => (
    <div data-testid="mobile-menu" data-open={isOpen}>
      <button onClick={() => closeMenu(false)}>Close</button>
    </div>
  ),
}));

vi.mock("../src/components/auth/Auth", () => ({
  default: ({ isOpen, onClose }) => (
    <div data-testid="auth-modal" data-open={isOpen}>
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

describe("Header component", () => {
  it("Render header branding and naviagte to home on click", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const brandImage = screen.getByAltText(BRANDING.imageSrc);
    const brandName = screen.getByText(BRANDING.brandName);
    expect(brandImage).toBeInTheDocument();
    expect(brandName).toBeInTheDocument();
    fireEvent.click(brandName);
    expect(window.location.pathname).toBe("/");
  });

  it("Render all header navigations", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    HEADER_ITEMS.forEach((item) => {
      const navItem = screen.getByText(item.title);
      expect(navItem).toBeInTheDocument();
    });
  });

  it("Header links should be clickable and navigate", async () => {
    render(
      <BrowserRouter>
        <Header />
        <Home />
      </BrowserRouter>
    );

    const headerElement = screen.getByTestId("header");
    for (const item of HEADER_ITEMS) {
      const navLink = within(headerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();
      await userEvent.click(navLink);
      const [path, sectionId] = item.url.split("#");
      expect(window.location.pathname).toBe(path);
      if (sectionId) {
        const sectionElement = screen.getByTestId(sectionId);
        expect(sectionElement).toBeInTheDocument();
      }
    }
  });

  it("Hamburger visible before and after screen width change", () => {
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButton).not.toBeInTheDocument();

    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const afterResizeMobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(afterResizeMobileMenuButton).toBeInTheDocument();
  });

  it("Mobile header toggle icon", async () => {
    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    await userEvent.click(mobileMenuButton);
    const closeIcon = screen.getByRole("button", { name: CROSS.alt });
    expect(closeIcon).toBeInTheDocument();
    await userEvent.click(closeIcon);
    const afterClose = screen.queryByRole("button", { name: CROSS.alt });
    expect(afterClose).not.toBeInTheDocument();
  });

  it("Mobile header auto close if width > 1024", async () => {
    window.innerWidth = 700;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    await userEvent.click(mobileMenuButton);
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    const mobileMenuButtonAfter = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButtonAfter).not.toBeInTheDocument();
  });

  it("Open and close authModal", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    const AuthModalBefore = screen.getByTestId("auth-modal");
    expect(AuthModalBefore).toHaveAttribute("data-open", "true");
    const closeModalButton = screen.getByText("Close Modal");
    fireEvent.click(closeModalButton);
    const AuthModalAfter = screen.getByTestId("auth-modal");
    expect(AuthModalAfter).toHaveAttribute("data-open", "false");
  });
});
