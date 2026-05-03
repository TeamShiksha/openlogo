import { expect, describe, it, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { render, screen, within, fireEvent } from "@testing-library/react";
import Footer from "../../src/components/footer/Footer";
import Home from "../../src/page/home/Home";
import PrivacyPolicy from "../../src/page/privacypolicy/PrivacyPolicy";
import { BRANDING, FOOTER_ITEMS } from "../../src/utils/Constants";
import {
  AuthContext,
  ToastContext,
  UserContext,
} from "../../src/contexts/Contexts";

const mockToastContext = {
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn(),
  show: vi.fn(),
  clear: vi.fn(),
  clearToast: vi.fn(),
};

describe("Footer Component", () => {
  it("Render footer branding", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const logoImage = screen.getByAltText(BRANDING.imageAlt);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", BRANDING.imageSrc);
    const logoText = screen.getByText(BRANDING.brandName);
    expect(logoText).toBeInTheDocument();
  });

  it("clicking OpenLogo navigates to the Home page", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
    const logoButton = screen.getByTestId("footer-logo-button");
    fireEvent.click(logoButton);
    expect(window.location.pathname).toBe("/");
  });

  it("Render all footer navigations", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    FOOTER_ITEMS.forEach((item) => {
      const footerLink = screen.getByText(item.title);
      expect(footerLink).toBeInTheDocument();
    });
  });

  it("Render powered by section", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    const copyrightElement = screen.getByText(
      new RegExp(`© ${new Date().getFullYear()}`, "i")
    );
    expect(copyrightElement).toBeInTheDocument();
    const poweredByLink = screen.getByText(BRANDING.poweredByText);
    expect(poweredByLink).toHaveAttribute("href", BRANDING.poweredByLink);
    expect(poweredByLink).toHaveAttribute("target", "_blank");
    expect(poweredByLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("Footer navigations should navigate to correct components", () => {
    const openCloseAuthModal = vi.fn();
    render(
      <BrowserRouter>
        <ToastContext.Provider value={mockToastContext}>
          <AuthContext.Provider value={{ isAuthenticated: false }}>
            <UserContext.Provider
              value={{
                userData: null,
                loading: false,
              }}
            >
              <Home openAuthModal={openCloseAuthModal} />
              <Footer />
              <PrivacyPolicy />
            </UserContext.Provider>
          </AuthContext.Provider>
        </ToastContext.Provider>
      </BrowserRouter>
    );

    const footerElement = screen.getByTestId("footer");
    for (const item of FOOTER_ITEMS) {
      const navLink = within(footerElement).getByText(item.title);
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
});
