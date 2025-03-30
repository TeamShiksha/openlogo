import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Header from "../../src/components/header/Header";
import Home from "../../src/page/home/Home";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  BUTTON_TEXT,
  BRANDING,
} from "../../src/utils/Constants";
import { AuthContext } from "../../src/contexts/Contexts";

const openCloseAuthModal = vi.fn();
const mockLogout = vi.fn();

const renderWithAuthContext = (ui, { isAuthenticated = false } = {}) => {
  return render(
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated: vi.fn(),
        logout: mockLogout,
      }}
    >
      {ui}
    </AuthContext.Provider>
  );
};

describe("Header component", () => {
  it("Render header branding and naviagte to home on click", () => {
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
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
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    HEADER_ITEMS.forEach((item) => {
      const navItem = screen.getByText(item.title);
      expect(navItem).toBeInTheDocument();
    });
  });

  it("Header links should be clickable and navigate", () => {
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
        <Home openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const headerElement = screen.getByTestId("header");
    for (const item of HEADER_ITEMS) {
      const navLink = within(headerElement).getByText(item.title);
      expect(navLink).toBeInTheDocument();
      fireEvent.click(navLink);
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
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButton).not.toBeInTheDocument();

    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const afterResizeMobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(afterResizeMobileMenuButton).toBeInTheDocument();
  });

  it("Mobile header toggle icon", () => {
    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    fireEvent.click(mobileMenuButton);
    const closeIcon = screen.getByRole("button", { name: CROSS.alt });
    expect(closeIcon).toBeInTheDocument();
    fireEvent.click(closeIcon);
    const afterClose = screen.queryByRole("button", { name: CROSS.alt });
    expect(afterClose).not.toBeInTheDocument();
  });

  it("Mobile header auto close if width > 1024", () => {
    window.innerWidth = 700;
    window.dispatchEvent(new Event("resize"));
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const mobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    fireEvent.click(mobileMenuButton);
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    const mobileMenuButtonAfter = screen.queryByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(mobileMenuButtonAfter).not.toBeInTheDocument();
  });

  it("Open and close authModal", () => {
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>
    );

    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    expect(openCloseAuthModal).toHaveBeenCalled();
  });

  it("Shows logout button when authenticated", () => {
    renderWithAuthContext(
      <BrowserRouter>
        <Header openAuthModal={openCloseAuthModal} />
      </BrowserRouter>,
      { isAuthenticated: true }
    );

    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();

    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
