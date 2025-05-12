import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, UserContext } from "../../src/contexts/Contexts";
import Header from "../../src/components/header/Header";
import Home from "../../src/page/home/Home";
import {
  HEADER_ITEMS,
  HAMBURGER,
  CROSS,
  BUTTON_TEXT,
  BRANDING,
} from "../../src/utils/Constants";

const openCloseAuthModal = vi.fn();

const mockAuthContext = (isAuthenticated) => ({
  isAuthenticated,
});

describe("Header component", () => {
  it("Render header branding and navigate to home on click", () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
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
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    HEADER_ITEMS.forEach((item) => {
      const navItem = screen.getByText(item.title);
      expect(navItem).toBeInTheDocument();
    });
  });

  it("Header links should be clickable and navigate", () => {
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <UserContext.Provider value={{ userData: null }}>
            <Header openAuthModal={openCloseAuthModal} />
            <Home openAuthModal={openCloseAuthModal} />
          </UserContext.Provider>
        </AuthContext.Provider>
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
    const authContext = mockAuthContext(false);
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
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
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const afterResizeMobileMenuButton = screen.getByRole("button", {
      name: HAMBURGER.alt,
    });
    expect(afterResizeMobileMenuButton).toBeInTheDocument();
  });

  it("Mobile header toggle icon", () => {
    const authContext = mockAuthContext(false);
    window.innerWidth = 1000;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
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
    const authContext = mockAuthContext(false);
    window.innerWidth = 700;
    window.dispatchEvent(new Event("resize"));
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
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
    const authContext = mockAuthContext(false);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const getStartedButton = screen.getByText(BUTTON_TEXT.getStarted);
    fireEvent.click(getStartedButton);
    expect(openCloseAuthModal).toHaveBeenCalled();
  });

  it("Removes Get started button if user is logged in", () => {
    const authContext = mockAuthContext(true);
    render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <Header openAuthModal={openCloseAuthModal} />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    const getStartedButtonText = screen.queryByText(BUTTON_TEXT.getStarted);
    expect(getStartedButtonText).not.toBeInTheDocument();
  });
});
